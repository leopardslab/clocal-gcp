# clocal-gcp

Emulation engine for GCP

_clocal-gcp_ provides an easy-to-use test/mocking framework for developing Cloud applications.

Currently features are under development.

# Overview

_clocal-gcp_ spins up the following core Cloud APIs on your local machine:

* **Cloud Functions** at http://localhost:7574
* **Cloud Data Store** at http://localhost:7569
* **Cloud CDN** at http://localhost:7581
* **Cloud ENDPOINTS** at http://localhost:7567
* **Cloud Storage** at http://localhost:7572

## Developing

Requirements \*

* NodeJS (^8.9.4)
* yarn (^1.6.0)

```
1.  git clone https://github.com/cloudlibz/clocal-gcp.git
```

```
2.  cd clocal-gcp
```

```
3.  yarn
```

```
4.  yarn dev <command>
```
