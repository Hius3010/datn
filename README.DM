Hướng dẫn cài đặt và chạy chương trình:
Bước 1: Tiến hành cài đặt Mosquitto MQTT Broker
	sudo apt-get update	
	sudo apt-get install mosquito
	sudo apt-get install mosquitto-clients
Bước 2: Cài đặt go-auth-mosquitto
	sudo apt-get install libwebsockets8 libwebsockets-dev libc-ares2 libc-ares-dev openssl uuid uuid-dev
	wget http://mosquitto.org/files/source/mosquitto-2.0.15.tar.gz
	tar xzvf mosquitto-2.0.15.tar.gz
	cd mosquitto-2.0.15
	make
	sudo make install
	sudo groupadd mosquitto
	sudo useradd -s /sbin/nologin mosquitto -g mosquitto -d /var/lib/mosquitto
	sudo mkdir -p /var/log/mosquitto/ /var/lib/mosquitto/
	sudo chown -R mosquitto:mosquitto /var/log/mosquitto/
	sudo chown -R mosquitto:mosquitto /var/lib/mosquitto/
Bước 3: Đối với server chưa có docker thì tiến hành cài đặt docker
	sudo apt update
	sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
	echo "deb [signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
	sudo apt update
	sudo apt install -y docker-ce
	sudo systemctl start docker
	sudo systemctl enable docker
	sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
	docker --version
	docker-compose --version
Bước 4: Giải nén code dự án 
	unzip datn.zip
Bước 5: Khởi chạy docker container 
	cd datn	
	docker-compose up -d 
Bước 6: Cấu hình và sử dung theo nhu cầu

