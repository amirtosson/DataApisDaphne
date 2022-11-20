"""
Created on Fri Feb 25 11:57:24 2022

@author: tosson
"""
import json
from flask import Flask, jsonify,Response, json, request
from flask_cors import CORS, cross_origin

import numpy as np
import sys
import logging
import os
import glob
import csv
import numpy as np
import pandas as pd
import pymongo

import pymongo

mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")

mongo_db = mongo_client["daphne"]

app = Flask(__name__)
df = pd.DataFrame()

CORS(app, resources={r"/*": {"origins": "*"}})

datasets_dir = "/home/tosson/Desktop/Projects/datasets/rawdatasets/"
datasets_attached_files_dir = "/home/tosson/Desktop/Projects/datasets/attached_files/"
@app.route('/api/python/checkdataset', methods=['POST'])
@cross_origin()
def generate_dataset():
    df = pd.DataFrame()
    dataset_doi = request.headers.get('dataset_doi')
    #structure_name = request.headers.get('structure_name')
    #if structure_name=="struc_text_test":
    print(dataset_doi)
    df = pd.concat([df, pd.read_csv(datasets_dir + dataset_doi, sep='\s+', header=(None, 0)[False])], axis=1)          
    #data_struc_text_validator(df)
    print(dataset_doi)
    mongo_collection = mongo_db["datasets_metadata"]
    query = { "dataset_doi": dataset_doi }
    newvalues = { "$set": {"columns_number":len(df.columns), "rows_number":len(df), "data_types":str(df.dtypes.tolist())} }
    x = mongo_collection.update_one(query, newvalues)    
    return jsonify({"updated":True, "RES":x.modified_count})


@app.route('/api/python/performcalculation', methods=['POST'])
@cross_origin()
def perform_calculation():
    df = pd.DataFrame()
    dataset_doi = request.headers.get('dataset_doi')
    request_data = request.get_json(force= True)
    df = pd.concat([df, pd.read_csv(datasets_dir + dataset_doi, sep='\s+', header=(None, 0)[False])], axis=1)          
    col = int(request_data['col_number'])-1
    if request_data['calc_name'] == 'average':
        aver = df.mean(axis = 0)
        return jsonify({"res":aver[col]})
    else:
        return jsonify({"done":False})


@app.route('/api/python/getdatasetcols', methods=['GET'])
@cross_origin()
def get_dataset_cols():
    df = pd.DataFrame()
    dataset_doi = request.headers.get('dataset_doi')
    col1 = request.headers.get('col1_name')
    col2 = request.headers.get('col2_name')
    df = pd.concat([df, pd.read_csv(datasets_dir + dataset_doi, sep='\s+', header=(None, 0)[False])], axis=1)          
    return jsonify({"col1":df[int(col1)-1].values.tolist(), "col2":df[int(col2)-1].values.tolist()})


def data_struc_text_validator(df):
    has_null = df.isnull().values.any()
    type_ok =  all( ty == 'float64' or ty == 'int' for ty in df.dtypes)
    return has_null and type_ok

@app.route('/api/python/uploadsinglefile', methods = ['POST'])
def upload_file():
    dataset_doi = "TESTDOI"
    request_data = request.get_json(force= True)
    #print(request_data['data'])
    response = jsonify({'some': 'data'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    f = request_data['data']
    f.save(datasets_dir + dataset_doi)
    return  response

@app.route('/api/python/getattachedfilesbydoi', methods = ['GET'])
def read_attached_files():
    dataset_doi = request.headers.get('dataset_doi')
    file_all = []
    for name in glob.glob(datasets_attached_files_dir + dataset_doi+'_atta_*'):
        f = open(name, "r")
        file_all.append(f.read())
    return  jsonify({"data":file_all})


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")