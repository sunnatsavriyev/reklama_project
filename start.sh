#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput --verbosity 0
python manage.py compilemessages

# python manage.py add_actions

python manage.py runserver 0.0.0.0:8020
   
