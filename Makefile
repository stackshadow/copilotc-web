

bootstrap: ./libs/jquery/jquery-3.2.1.min.js ./libs/bootstrap/js/bootstrap.min.js
c3: ./libs/c3/c3.min.js
d3: ./libs/d3/d3.min.js
notify: ./libs/notify.min.js

./libs/jquery/jquery-3.2.1.min.js:
	mkdir -p ./libs/jquery
	cd libs/jquery && wget -c https://code.jquery.com/jquery-3.2.1.min.js


##################################### Bootstrap #####################################
./libs/bootstrap-3.3.7-dist.zip:
	cd libs && wget -c \
	https://github.com/twbs/bootstrap/releases/download/v3.3.7/bootstrap-3.3.7-dist.zip

./libs/bootstrap-3.3.7-dist/js/bootstrap.min.js: ./libs/bootstrap-3.3.7-dist.zip
	cd libs && unzip -o bootstrap-3.3.7-dist.zip

./libs/bootstrap/js/bootstrap.min.js: ./libs/bootstrap-3.3.7-dist/js/bootstrap.min.js
	cd libs && ln -fs bootstrap-3.3.7-dist bootstrap


##################################### D3 / C3 #####################################

./libs/d3-v3.5.17.zip:
	curl -L 'https://github.com/d3/d3/releases/download/v3.5.17/d3.zip' -o $@
./libs/d3/d3.min.js:
	mkdir -p ./libs/d3
	unzip ./libs/d3-v3.5.17.zip -d ./libs/d3

./libs/c3:
	mkdir -p ./libs/c3
./libs/c3/c3.min.css: ./libs/c3
	curl -L 'https://raw.githubusercontent.com/c3js/c3/master/c3.min.css' -o $@
./libs/c3/c3.min.js: ./libs/c3/c3.min.css
	curl -L 'https://raw.githubusercontent.com/c3js/c3/master/c3.min.js' -o $@


##################################### Notify #####################################

./libs/notify.min.js:
	curl -L 'https://raw.githubusercontent.com/mouse0270/bootstrap-notify/master/bootstrap-notify.min.js' \
	-o $@

#./libs/bootstrap/js/bootstrap.min.js: ./libs/bootstrap-4.0.0-alpha.6-dist/js/bootstrap.min.js
#	cd libs && ln -fs bootstrap-4.0.0-alpha.6-dist bootstrap

#./libs/bootstrap-4.0.0-alpha.6-dist/js/bootstrap.min.js: ./libs/bootstrap-4.0.0-alpha.6-dist.zip
#	cd libs && unzip -o bootstrap-4.0.0-alpha.6-dist.zip

#./libs/bootstrap-4.0.0-alpha.6-dist.zip:
#	cd libs && wget -c \
#	https://github.com/twbs/bootstrap/releases/download/v4.0.0-alpha.6/bootstrap-4.0.0-alpha.6-dist.zip


##################################### install #####################################
webfiles = $(shell pkg-config --libs libsodium)

nginx-service: $(prefix)/lib/systemd/system/nginx-copilotc.service
$(prefix)/lib/systemd/system/nginx-copilotc.service: nginx-copilotc.service
	@cp -v $< $@
	@systemctl daemon-reload

nginx-conf: /etc/nginx/nginx-copilotc.conf
/etc/nginx/nginx-copilotc.conf: nginx.conf
	@cp -v $< $@

install-nginx: nginx-service nginx-conf
	@mkdir -p /var/www/copilotc-web
	@cp -Rv css /var/www/copilotc-web/
	@cp -Rv libs /var/www/copilotc-web/
	@cp -Rv services /var/www/copilotc-web/
	@cp -v index.html /var/www/copilotc-web/

