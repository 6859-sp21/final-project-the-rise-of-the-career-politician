
import json
import os
import urllib.request

import pandas as pd
import numpy as np 

DIRNAME = os.path.dirname(__file__)


def main():
    legislators_current = 'https://theunitedstates.io/congress-legislators/legislators-current.json'
    legislators_historical = 'https://theunitedstates.io/congress-legislators/legislators-historical.json'

    with urllib.request.urlopen(legislators_current) as url:
        congress_data = json.loads(url.read().decode())

    with urllib.request.urlopen(legislators_historical) as url:
        congress_data += json.loads(url.read().decode())

    # Make a list of all people and their biographical information
    all_congressmen = {}
    for item in congress_data:
        all_congressmen[item['id']['bioguide']] = {**item['bio'], **item['id'], **item['name']}

    # Add ideological data to the mix
    remote_url = 'https://voteview.com/static/data/out/members/HSall_members.csv'
    temp_df = pd.read_csv(remote_url)
    temp_df = temp_df.fillna(-99)
    for index, row in temp_df.iterrows():
        try:
            key = row['bioguide_id']
        except:
            key = 0
        cols_to_add = ['nominate_dim1', 'nominate_dim2', 'nokken_poole_dim1', 'nokken_poole_dim2']
        for col in cols_to_add:
            if key in all_congressmen:
                all_congressmen[key][col] = row[col]

    # Make a dictionary of the form: {year: [terms]}

    all_terms = []
    for item in congress_data:
        min_bio = ['bioguide', 'wikidata', 'wikipedia', 'birthday', 'official_full']
        key = item['id']['bioguide'] 
        min_bio_dict = {x: all_congressmen[key].get(x, 'unknown') for x in min_bio}
        for term in item['terms']:
            all_terms.append({**min_bio_dict, **term})

    df = pd.DataFrame(all_terms)
    date_cols = ['start', 'end', 'birthday']
    for col in date_cols:
        df[col] = df[col].apply(lambda x: pd.to_datetime(x) if not x == 'unknown' else x)

    def get_congress(date):
        # returns the people in congress at the specified date 
        return df[(df['start'] < date) & (df['end'] > date)]


    time_list = []
    for i in range(1790, 2022):
        temp_df = get_congress(f'{i}-04-01')
        temp_df['year'] = temp_df.type.apply(lambda x: i)
        time_list.append(temp_df)

    congress_by_year = pd.concat(time_list)
    congress_by_year['id'] = congress_by_year.bioguide
    congress_by_year['years'] = congress_by_year.year.apply(lambda x: 1)
    congress_by_year['cumulative_time'] = congress_by_year.groupby(['id','type']).years.transform(lambda x: x.cumsum())
    congress_by_year['cumulative_time_sen_and_house'] = congress_by_year.groupby(['id']).years.transform(lambda x: x.cumsum())
    congress_by_year['max_time'] = congress_by_year.groupby(['id','type']).years.transform(lambda x: x.sum())
    congress_by_year['time_sen_and_house'] = congress_by_year.groupby('id').years.transform(lambda x: x.sum())
    congress_by_year['id/type'] = congress_by_year.apply(lambda x: x.type+'/'+x.id, axis=1)

    def compute_age(x):
        try:
            return x.year - x.birthday.year
        except Exception:
            return -1
    congress_by_year['age'] = congress_by_year.apply(compute_age, axis=1)
    congress_by_year['min_age'] = congress_by_year.groupby(['id']).age.transform(lambda x: x.min())
    congress_by_year['max_age'] = congress_by_year.groupby(['id']).age.transform(lambda x: x.max())

    congress_by_year['district'] = congress_by_year.apply(
        lambda x: 'sen' if x.type == 'sen' else int(x.district), axis=1)

    drop_cols = ['url', 'address', 'phone', 'fax', 'contact_form', 'office', 
        'rss_url', 'how', 'caucus', 'party_affiliations', 'end-type', 'years']

    congress_by_year = (congress_by_year.drop(columns=drop_cols)
                                        .fillna(-99)
                        )

    def cast(df):
        # casting as string if not serializable  
        for column, dt in zip(df.columns, df.dtypes):
            if dt.type not in [
                np.int64,
                np.float_,
                np.bool_,
            ]:
                df.loc[:, column] = df[column].astype(str)
        return df

    year_dict = {}
    for year in range(1790, 2022):
        year_dict[year] = cast(congress_by_year.query(f'year == {year}')).to_dict(orient='records')

    with open(os.path.join(DIRNAME, '../public/data/congress_by_year.json'), 'w') as fp:
        json.dump(year_dict, fp)

    print('saved congressional information')

    cols_to_dupl = ['min_age', 'max_age', 'time_sen_and_house']
    for key in all_congressmen.keys():
        try:
            temp = congress_by_year[congress_by_year['id'] == key].iloc[0, :]
            for col in cols_to_dupl:
                all_congressmen[key][col] = str(temp[col])
        except Exception as e:
            print(all_congressmen[key]['wikipedia'], ' may not have served a full year')

    with open(os.path.join(DIRNAME, '../public/data/all_congressmen.json'), 'w') as fp:
        json.dump(all_congressmen, fp)
    print('saved bio information on congressmen')


if __name__ == "__main__":
    main()
