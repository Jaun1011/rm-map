# Rolemaster character generator

[local](http://localhost:8000)
[test](http://localhost:8000/index.test.html)

```bash                
python3 -m http.server

```

## Todo

- [ ] add spells
- [ ] add level adder
- [ ]




    character$.onChange(_ => selectedSpells$.getValue().forEach(spell$ => updateSpellLevel(spell$, spell$.getValue().level)))
