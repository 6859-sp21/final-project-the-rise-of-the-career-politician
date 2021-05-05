import os
import urllib.request
import pandas as pd
from functools import reduce

years = list(range(2013, 2021))
chambers = ['house', 'senate']

metrics = ['cosponsored', 'bills-introduced', 'bills-reported',
           'committee-positions', 'cosponsors', 'ideology',
           'cosponsored-other-party', 'bills-enacted-ti', 'leadership',
           'missed-votes', 'bills-with-committee-leaders',
           'bills-with-companion', 'bills-with-cosponsor-other-party']

i_cols = [3, 5]  # columns to keep (just the metric and the bioguide)

def remove_quotes(col):
    # saving json with a '-' creates an access problem 
    return col.replace('-', '_')

year_dfs = []
for y in years:
    full_congress = []
    for c in chambers:
        dfs = []
        for m in metrics:
            url = f'https://www.govtrack.us/congress/members/report-cards/{y}/{c}/{m}.csv'
            try:
                dfs.append(pd.read_csv(url))
            except Exception as e:
                print(e, 'could not get csv for metric ', m, 'at url', url)

        if len(dfs) > 0:
            full_congress.append(
                reduce(
                    lambda left, right: pd.merge(left,
                                                 right,
                                                 on=['bioguide_id'],
                                                 how='inner'),
                    [x.iloc[:, i_cols] for x in dfs]
                )
            )
        else:
            print('empty dataframe list for year', y)

    if len(full_congress) > 0:
        (
            pd.concat(full_congress)
              .set_index('bioguide_id')
              .rename(columns=remove_quotes)
              .to_json(f'./public/data/report_cards/{y}-report-card.json', orient='index')
        )