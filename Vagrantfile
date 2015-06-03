# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "puppetlabs/ubuntu-14.04-64-nocm"
  
  config.vm.network "forwarded_port", guest: 8002, host: 8002

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  #
  config.vm.provider "virtualbox" do |vb|
  # Allow symbolic link inside shared directory (used for moving node_modules)
	vb.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/path/to/guest/shared/directory", "1"]
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  end
  
  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    sudo apt-get install -y nodejs npm git ruby-sass
	sudo ln -s /usr/bin/nodejs /usr/bin/node
	sudo npm install -g bower
	sudo npm install -g grunt-cli
	sudo mkdir /nodes_modules/
	sudo ln -s /vagrant/node_modules/ /nodes_modules
	cd /vagrant && sudo npm install 
	cd /vagrant && sudo -u vagrant bower install --config.interactive=false
	cd /vagrant && grunt init
  SHELL
end
