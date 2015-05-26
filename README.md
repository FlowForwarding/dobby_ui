# dobby_ui
Dobby UI

## Installation 
1. checkout dobby from github
2. `rebar compile`
3. `rebar generate`
4. start dobby: `rel/dobby/bin/dobby console`
5. checkout dobby_rest from github
6. `make`
7. checkout dobby_ui
8. (install nodejs if you don't have it)
9. `npm install`
10. link `dobby_ui/www` to `dobby_rest/rel/dobby_rest/lib/dobby_rest-1/priv/static/www` to allow the dobby_rest web server to serve the javascript files for the UI in Chrome, open `localhost:8080//static/www/index.html`

To get sample data into dobby:

1. checkout weave from github
2. `cd util`
3. `./mk_json example_topology  > /tmp/json`
4. In the dobby console: `dby_bulk:import(json0, "/tmp/json").`
