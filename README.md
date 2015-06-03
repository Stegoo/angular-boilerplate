# angular-boilerplate
Angular skeleton I use to set up my projects

Run npm install, bower install, grunt init, grunt dev and python server.py



## Using vagrant

First, as administrator, execute the following command in order to allow symbolic links on windows :
```bash
	fsutil behavior set SymlinkEvaluation L2L:1 R2R:1 L2R:1 R2L:1
```bash

In a standard windows console:
```bash
> vagrant up
> vagrant ssh
```bash

Then inside the VM :

```bash
$> cd /vagrant
$> python3 server.py &
$> grunt dev
```bash

To finish, open your favorite browser and visit : http://127.0.0.1:8002/

