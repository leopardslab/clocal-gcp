import express from 'express';
import { Express } from 'express';
import { Server } from 'http';
import CloudLocal from '../gcp/cloud-local';

class CloudFunction extends CloudLocal {
  init() {
    this.port = 7574;
    this.app.get('/', (req, res) => {
      res.send('Welcome to cloud functions local');
    });
  }
}

export default CloudFunction;
