

all: dir-sources bootstrap bootstrap-treeview bootstrap-select dataTables
# bootstrap


c3: ./libs/c3/c3.min.js
d3: ./libs/d3/d3.min.js
notify: ./libs/notify.min.js
tokenfield: ./libs/bootstrap-tokenfield.js

##################################### helper #####################################
dir-sources:
	mkdir -p ./libs/sources


##################################### jquery #####################################
jquery: ./libs/jquery/jquery-3.2.1.min.js ./libs/jquery/jquery-ui-1.12.1.min.js
./libs/jquery/jquery-3.2.1.min.js:
	mkdir -p ./libs/jquery
	cd libs/jquery && wget -c https://code.jquery.com/jquery-3.2.1.min.js

./libs/jquery/jquery-ui-1.12.1.min.js:
	curl -L 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js' \
	-o $@


##################################### Bootstrap #####################################
bootstrap: jquery ./libs/bootstrap/js/bootstrap.min.js
./libs/sources/bootstrap-3.3.7-dist.zip:
	curl -L 'https://github.com/twbs/bootstrap/releases/download/v3.3.7/bootstrap-3.3.7-dist.zip' \
	-o $@
./libs/bootstrap-3.3.7-dist/js/bootstrap.js: ./libs/sources/bootstrap-3.3.7-dist.zip
	cd libs && unzip -o ./sources/bootstrap-3.3.7-dist.zip
./libs/bootstrap/js/bootstrap.min.js: ./libs/bootstrap-3.3.7-dist/js/bootstrap.js
	cd libs && ln -fs bootstrap-3.3.7-dist bootstrap


##################################### bootstrap-treeview #####################################
bootstrap-treeview: ./libs/bootstrap/js/bootstrap-treeview.min.js ./libs/bootstrap/css/bootstrap-treeview.min.css
./libs/bootstrap/js/bootstrap-treeview.min.js:
	curl -L 'https://raw.githubusercontent.com/jonmiles/bootstrap-treeview/master/dist/bootstrap-treeview.min.js' \
	-o $@
./libs/bootstrap/css/bootstrap-treeview.min.css:
	curl -L 'https://raw.githubusercontent.com/jonmiles/bootstrap-treeview/master/dist/bootstrap-treeview.min.css' \
	-o $@


##################################### bootstrap-select #####################################
bootstrap-select: ./libs/bootstrap-select/js/bootstrap-select.min.js
./libs/sources/bootstrap-select-1.13.0-beta.zip:
	curl -L 'https://github.com/snapappointments/bootstrap-select/releases/download/v1.13.0-beta/bootstrap-select-1.13.0-beta.zip' \
	-o $@
./libs/bootstrap-select-1.13.0-beta/js/bootstrap-select.min.js:
	cd libs && unzip -o ./sources/bootstrap-select-1.13.0-beta.zip
./libs/bootstrap-select/js/bootstrap-select.min.js: ./libs/bootstrap-select-1.13.0-beta/js/bootstrap-select.min.js
	ln -fs ./bootstrap-select-1.13.0-beta ./libs/bootstrap-select



##################################### dataTAbles #####################################

dataTables: ./libs/dataTables/css/jquery.dataTables.min.css ./libs/dataTables/js/jquery.dataTables.min.js
./libs/dataTables/css/jquery.dataTables.min.css:
	mkdir -p ./libs/dataTables/css
	curl -L 'https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css' \
	-o $@
./libs/dataTables/js/jquery.dataTables.min.js:
	mkdir -p ./libs/dataTables/js
	curl -L 'https://cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js' \
	-o $@





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


##################################### tokenfield #####################################
./libs/bootstrap-tokenfield.js: ./libs/bootstrap-tokenfield.css
	curl -L 'https://raw.githubusercontent.com/sliptree/bootstrap-tokenfield/v0.12.1/dist/bootstrap-tokenfield.min.js' \
	-o $@

./libs/bootstrap-tokenfield.css:
	curl -L 'https://raw.githubusercontent.com/sliptree/bootstrap-tokenfield/master/dist/css/bootstrap-tokenfield.min.css' \
	-o $@






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

