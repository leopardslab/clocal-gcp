# clocal-gcp

Emulation engine for GCP

clocal-gcp provides an easy-to-use test/mocking framework for developing Cloud applications.

Currently features are under development.

## 🚀 Install

```
$ git clone https://github.com/cloudlibz/clocal-gcp.git

$ cd clocal-gcp

$ yarn

$ yarn start <command>
```

## ⚽ Command List

* ## clocal-gcp func
    **start clocal-gcp function emulator**
    * func start
    * func stop
    * func deploy
    * func call
    * func list
    * func delete
* ## clocal-gcp storage
    **start clocal-gcp storage emulator**
    * storage start
    * storage stop
    * storage create
    * storage delete
    * storage cp
    * storage ls
* ## clocal-gcp mem
    **start clocal-gcp memcache emulator**
    * mem start
    * mem stop

**In development replace clocal-gcp with 'npm start' or 'yarn start'**

### Example command 
    * clocal-gcp func start
### Example command in development
    * npm start func start

# 📚 Overview

_clocal-gcp_ spins up the following core Cloud APIs on your local machine:

* **Cloud Functions** at [http://localhost:7574](https://)
* **Cloud Data Store** at [http://localhost:7569](https://)
* **Cloud CDN** at [http://localhost:7581](https://)
* **Cloud ENDPOINTS** at [http://localhost:7567](https://)
* **Cloud Storage** at [http://localhost:7572](https://)
