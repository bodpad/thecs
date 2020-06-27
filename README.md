    python -m venv venv
    venv\Scripts\activate
    npm i
    npm run build:front
    tsc
    sass .
    pip install -r requirements.txt
    python manage.py runserver


## Helper commands

### Translates
    python manage.py makemessages -a -i node_modules
    python manage.py compilemessages

### Build front
    npm run build:front && python manage.py buildfront

### Dump and load data
    python manage.py dumpdata --exclude=contenttypes > dump.json
    cat dump.json | heroku run --no-tty -- python manage.py loaddata --format=json -
