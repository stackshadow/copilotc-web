

all: dir-sources bootstrap bootstrap-treeview bootstrap-tokenfield bootstrap-select dataTables bootstrap-patternfly d3 c3 notify
# bootstrap

tokenfield: ./libs/bootstrap-tokenfield.js

##################################### helper #####################################
dir-sources:
	mkdir -p ./libs/sources


##################################### jquery #####################################
jquery: ./libs/jquery/jquery-3.2.1.min.js ./libs/jquery/jquery-ui-1.12.1.min.js
./libs/jquery/jquery-3.2.1.min.js:
	mkdir -p ./libs/jquery
	curl -L 'https://code.jquery.com/jquery-3.2.1.min.js' \
	-o $@

./libs/jquery/jquery-ui-1.12.1.min.js:
	curl -L 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js' \
	-o $@


##################################### Bootstrap #####################################
bootstrap: jquery ./libs/bootstrap/js/bootstrap.min.js ./libs/bootstrap/css/ionicons.min.css
./libs/bootstrap/css/bootstrap.min.css:
	mkdir -p ./libs/bootstrap/css
	curl -L 'https://raw.githubusercontent.com/twbs/bootstrap/v4.1.1/dist/css/bootstrap.min.css' \
	-o $@
./libs/bootstrap/js/bootstrap.min.js: ./libs/bootstrap/css/bootstrap.min.css
	mkdir -p ./libs/bootstrap/js
	curl -L 'https://raw.githubusercontent.com/twbs/bootstrap/v4.1.1/dist/js/bootstrap.min.js' \
	-o $@
./libs/bootstrap/css/ionicons.min.css:
	curl -L 'https://github.com/ionic-team/ionicons/raw/master/css/ionicons.min.css' -o ./libs/bootstrap/css/ionicons.min.css
	mkdir -p ./libs/bootstrap/fonts
	curl -L 'https://github.com/ionic-team/ionicons/raw/master/fonts/ionicons.eot' -o ./libs/bootstrap/fonts/ionicons.eot
	curl -L 'https://github.com/ionic-team/ionicons/raw/master/fonts/ionicons.svg' -o ./libs/bootstrap/fonts/ionicons.svg
	curl -L 'https://github.com/ionic-team/ionicons/raw/master/fonts/ionicons.ttf' -o ./libs/bootstrap/fonts/ionicons.ttf
	curl -L 'https://github.com/ionic-team/ionicons/raw/master/fonts/ionicons.woff' -o ./libs/bootstrap/fonts/ionicons.woff




##################################### bootstrap-treeview #####################################
bootstrap-treeview: ./libs/bootstrap/js/bootstrap-treeview.min.js ./libs/bootstrap/css/bootstrap-treeview.min.css
./libs/bootstrap/js/bootstrap-treeview.min.js:
	curl -L 'https://raw.githubusercontent.com/jonmiles/bootstrap-treeview/master/dist/bootstrap-treeview.min.js' \
	-o $@
./libs/bootstrap/css/bootstrap-treeview.min.css:
	curl -L 'https://raw.githubusercontent.com/jonmiles/bootstrap-treeview/master/dist/bootstrap-treeview.min.css' \
	-o $@


##################################### bootstrap-tokenfielt #####################################
bootstrap-tokenfield: ./libs/bootstrap-tokenfield/js/bootstrap-tokenfield.js
./libs/sources/bootstrap-tokenfield-0.12.0.tar.gz:
	curl -L 'https://github.com/sliptree/bootstrap-tokenfield/archive/v0.12.0.tar.gz' \
	-o $@

./libs/bootstrap-tokenfield-0.12.0/js/bootstrap-tokenfield.js: ./libs/sources/bootstrap-tokenfield-0.12.0.tar.gz
	tar -C ./libs -xaf ./libs/sources/bootstrap-tokenfield-0.12.0.tar.gz
./libs/bootstrap-tokenfield/js/bootstrap-tokenfield.js: ./libs/bootstrap-tokenfield-0.12.0/js/bootstrap-tokenfield.js
	ln -fs bootstrap-tokenfield-0.12.0 ./libs/bootstrap-tokenfield

##################################### popper #####################################
popper: ./libs/popper.min.js
./libs/popper.min.js:
	curl -L 'https://unpkg.com/popper.js/dist/umd/popper.min.js' \
	-o $@

##################################### bootstrap-select #####################################
bootstrap-select: ./libs/bootstrap-select/js/bootstrap-select.min.js popper
./libs/sources/bootstrap-select-1.13.0-beta.zip:
	curl -L 'https://github.com/snapappointments/bootstrap-select/releases/download/v1.13.0-beta/bootstrap-select-1.13.0-beta.zip' \
	-o $@
./libs/bootstrap-select-1.13.0-beta/js/bootstrap-select.min.js: ./libs/sources/bootstrap-select-1.13.0-beta.zip
	cd libs && unzip -o ./sources/bootstrap-select-1.13.0-beta.zip
./libs/bootstrap-select/js/bootstrap-select.min.js: ./libs/bootstrap-select-1.13.0-beta/js/bootstrap-select.min.js
	ln -fs ./bootstrap-select-1.13.0-beta ./libs/bootstrap-select



##################################### dataTAbles #####################################

dataTables: ./libs/dataTables/css/jquery.dataTables.min.css ./libs/dataTables/js/jquery.dataTables.min.js ./libs/dataTables/images/favicon.ico
./libs/dataTables/css/jquery.dataTables.min.css:
	mkdir -p ./libs/dataTables/css
	curl -L 'https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css' \
	-o $@
./libs/dataTables/js/jquery.dataTables.min.js:
	mkdir -p ./libs/dataTables/js
	curl -L 'https://cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js' \
	-o $@
./libs/dataTables/images/favicon.ico:
	mkdir -p ./libs/dataTables/images
	curl -L 'https://github.com/DataTables/DataTables/raw/1.10.16/media/images/Sorting icons.ico' 		-o './libs/dataTables/images/Sorting icons.ico'
	curl -L 'https://github.com/DataTables/DataTables/raw/1.10.16/media/images/sort_asc.png' 			-o './libs/dataTables/images/sort_asc.png'
	curl -L 'https://github.com/DataTables/DataTables/raw/1.10.16/media/images/sort_asc_disabled.png' 	-o './libs/dataTables/images/sort_asc_disabled.png'
	curl -L 'https://github.com/DataTables/DataTables/raw/1.10.16/media/images/sort_both.png' 			-o './libs/dataTables/images/sort_both.png'
	curl -L 'https://github.com/DataTables/DataTables/raw/1.10.16/media/images/sort_desc.png' 			-o './libs/dataTables/images/sort_desc.png'
	curl -L 'https://github.com/DataTables/DataTables/raw/1.10.16/media/images/sort_desc_disabled.png' 	-o './libs/dataTables/images/sort_desc_disabled.png'
	curl -L 'https://github.com/DataTables/DataTables/raw/1.10.16/media/images/favicon.ico'       		-o './libs/dataTables/images/favicon.ico'





##################################### D3 / C3 #####################################
d3: ./libs/d3/d3.min.js
./libs/d3:
	mkdir -p $@
./libs/d3/d3.min.js: ./libs/d3
	curl -L 'https://d3js.org/d3.v5.min.js' -o $@

c3: ./libs/c3/c3.min.js
./libs/c3:
	mkdir -p ./libs/c3
./libs/c3/c3.min.css: ./libs/c3
	curl -L 'https://raw.githubusercontent.com/c3js/c3/master/c3.min.css' -o $@
./libs/c3/c3.min.js: ./libs/c3/c3.min.css
	curl -L 'https://raw.githubusercontent.com/c3js/c3/master/c3.min.js' -o $@



##################################### Notify #####################################
notify: ./libs/notify.js
./libs/notify.js:
	curl -L 'https://raw.githubusercontent.com/jpillora/notifyjs/master/dist/notify.js' \
	-o $@

./libs/notify.min.js:
	curl -L 'https://raw.githubusercontent.com/mouse0270/bootstrap-notify/master/bootstrap-notify.min.js' \
	-o $@



##################################### patternfly #####################################
bootstrap-patternfly: ./libs/patternfly/dist/js/patternfly.min.js
./libs/sources/patternfly-v3.44.0.tar.gz:
	curl -L 'https://github.com/patternfly/patternfly/archive/v3.44.0.tar.gz' \
	-o $@
./libs/patternfly-3.44.0/dist/js/patternfly.min.js: ./libs/sources/patternfly-v3.44.0.tar.gz
	tar -C ./libs -xaf $<
./libs/patternfly/dist/js/patternfly.min.js: ./libs/patternfly-3.44.0/dist/js/patternfly.min.js
	ln -fs patternfly-3.44.0 ./libs/patternfly

##################################### install #####################################
webfiles = $(shell pkg-config --libs libsodium)

nginx-service: $(prefix)/lib/systemd/system/nginx-copilotc.service
$(prefix)/lib/systemd/system/nginx-copilotc.service: nginx-copilotc.service
	@cp -v $< $@
	@systemctl daemon-reload

nginx-conf: /etc/nginx/nginx-copilotc.conf
/etc/nginx/nginx-copilotc.conf: nginx.conf
	@cp -v $< $@

install-nginx: webfiles nginx-service nginx-conf


webfiles: /var/www/copilotc-web/index.html
/var/www/copilotc-web/index.html:
	@mkdir -p /var/www/copilotc-web
	@cp -Rv libs /var/www/copilotc-web/
	@cp -Rv services /var/www/copilotc-web/
	@cp -v index.html /var/www/copilotc-web/

webservice: $(prefix)/lib/systemd/system/copilotc-python.service
$(prefix)/lib/systemd/system/copilotc-python.service: copilotc-python.service
	@cp -v $< $@
	@systemctl daemon-reload

test:
	/usr/bin/python3 -m http.server 8000

install: webfiles webservice




