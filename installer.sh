#!/bin/bash

CPU_CORES=$(nproc)

pm2_auto_run() {
  echo "pm2_auto_run"
  /usr/local/bin/pm2 startup
  /usr/local/bin/pm2 startup upstart
  /usr/local/bin/pm2 save
}

configurate_haproxy() {
  cat <<EOT >> /etc/haproxy/haproxy.cfg

# The public 'www' address in the DMZ
frontend localnodes
        bind            *:80
        mode            http
        log             global
        option          httplog
        option          dontlognull
        monitor-uri     /monitoruri
        maxconn         8000
        timeout client  30s
        default_backend nodes

# the application servers go here
backend nodes
        mode            http
        balance         roundrobin
        retries         2
        timeout connect 5s
        timeout server  30s
        timeout queue   30s
EOT

for i in $(eval echo "{1..$CPU_CORES}")
do
        echo "        server          server1 127.0.0.1:8$i check" >> /etc/haproxy/haproxy.cfg
done

systemctl restart haproxy.service
}

echo "Установка"
echo "Количество ядер - $CPU_CORES"

apt-get update
yes | apt-get install nodejs
yes | apt-get install npm
yes | apt-get install haproxy
configurate_haproxy

npm install -g n
n stable
yes | apt-get install git
yes | apt-get install -y mongodb
mongod
npm i -g yarn

git clone https://github.com/algoritm13121/imex.git
cd imex
yarn global add pm2@latest
yarn install
yarn seeds
yarn deploy

pm2_auto_run

cd /root/imex/helpers
yarn install
(crontab -l 2>/dev/null; echo "0 */1 * * * /usr/bin/node /root/imex/helpers/backup/start.js") | crontab -

echo "Установка завершена"
