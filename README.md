<b>TheCS.org</b> - это образовательный ресурс посвященный **Алгоритмам** и **Структурам данных**.
Это важный раздел информатики (computer since) дающее фундаментальное представелние о способах эффективного хранения и организации данных в памяти компьютера и использованию их для решения самого разнообразного круга задач.
Тот необходимый фундамент знаний и навыков, который позволит вам открывать новые горизонты в вашей
профессиональной деятельности.

## Helper commands
### Run locale
    python -m venv venv
    venv\Scripts\activate
    npm i
    npm run build:front
    tsc
    sass .
    pip install -r requirements.txt
    python manage.py runserver

### Translates
    python manage.py makemessages -a -i venv -i node_modules
    python manage.py compilemessages -i venv -i node_modules

### Build front
    python manage.py pg build

### Dump and load data
    python manage.py dumpdata --exclude=contenttypes > dump.json
    heroku run python manage.py flush --no-input
    cat dump.json | heroku run --no-tty -- python manage.py loaddata --format=json -
