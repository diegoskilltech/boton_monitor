var logger = require('log4js').getLogger('com.monitor');
var config = require('../../config/config');

var _ = require('underscore');
var aws = require('aws-sdk');

/**
 * GET sign.
 */
exports.sign = function(req, res, next){
	logger.info('upload : sign : about to sign a company document upload...');
	var companyId = req.params.id;
	var folderName = req.query.folderName;
	var objectName = req.query.objectName;
	var objectType = req.query.objectType;

	//Compose the key with company id as prefix and a folder
	var key = companyId + '/' + (folderName ? folderName + '/' : '' ) + objectName;

	aws.config.update(_.pick(config.aws, 'accessKeyId', 'secretAccessKey'));

	var s3 = new aws.S3(); 
	var parameters = { 
		Bucket: config.aws.docsBucket,
		Key: key,
		Expires: 60, 
		ContentType: objectType,
		ACL: 'public-read'
	}; 

	s3.getSignedUrl('putObject', parameters, function(err, data){ 
		if(!err){ 
			var result = {
				signedRequest: data,
				url: 'https://'+ config.aws.docsBucket +'.s3.amazonaws.com/' + key 
			};
			res.write(JSON.stringify(result));
			res.end();
		}else{ 
			logger.error('upload : sign : error trying to sign sale doc upload', err);
			res.send(err);
		} 
	});

};

