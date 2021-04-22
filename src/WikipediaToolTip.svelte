
	/* 
	https://stackoverflow.com/questions/34393884/how-to-get-image-url-property-from-wikidata-item-by-api

	1. query entity name https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=Q518823&format=json
	2. take picture value and md5 hash it
	3. image is at https://upload.wikimedia.org/wikipedia/commons/f/f7/Richard_bassett.jpg
	f is first digit of md5, f7 are first two, end with name
	*/