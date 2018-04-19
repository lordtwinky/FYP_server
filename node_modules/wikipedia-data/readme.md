# wikipedia-data

Useful wikipedia data.

## Data files:

### disambiguation-names.json

Disambiguation name by language:
```
{
  "en": "Disambiguation",
  "br": "Disheñvelout",
  ...
}
```

### disambiguation-names2.json

Same as `disambiguation-names.json` only for 2 chars language codes.

### disambiguation-categories.json

Disambiguation category by language:
```
{
  "an": "Categoría:Desambigación",
  "az": "Kateqoriya:Vikipediya:Dəqiqləşdirmə",
  ...
}
```

### disambiguation-categories2.json

Same as `disambiguation-categories.json` only for 2 chars language codes.

## Nodejs usage:

```
var wikiData = require('wikipedia-data');
var categories = wikiData.getDisambiguationCategories2();
var names = wikiData.getDisambiguationNames2();
```
