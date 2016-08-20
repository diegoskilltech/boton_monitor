(function() {

/**
* AWS S3 Upload helper class
*/
window.S3Upload = (function() {
	S3Upload.prototype.signUrl = '/api/:id/upload/sign';
	S3Upload.prototype.companyId = '';
	S3Upload.prototype.selector = 'file_upload';

	/**
	* Client handler for finish
	*/
	S3Upload.prototype.onFinish = function(publicUrl) {
		return console.log('base.onFinish()', publicUrl);
	};

	/**
	* Client handler for progress
	*/
	S3Upload.prototype.onProgress = function(percent, status) {
		return console.log('base.onProgress()', percent, status);
	};

	/**
	* Client handler for error
	*/
	S3Upload.prototype.onError = function(status) {
		return console.log('base.onError()', status);
	};

	/**
	* Class Constructor
	*/
	function S3Upload(options) {
		if (options == null) options = {};
		for (option in options) {
			this[option] = options[option];
		}

		this.signUrl = this.signUrl.replace(/:id/g, this.companyId);
		this.handleFileSelect(document.getElementById(this.selector));
	}


	//To handle the file by the given selector, takes the file and calls the uploadFile
	S3Upload.prototype.handleFileSelect = function(file) {
		var f, files, output, _i, _len, _results;
		this.onProgress(0, 'Upload started.');
		files = file.files;
		output = [];
		result = [];

		for (_i = 0, _len = files.length; _i < _len; _i++) {
			f = files[_i];
			result.push(this.uploadFile(f));
		}
		return result;
	};

	//Helper to build the xhr
	S3Upload.prototype.createCORSRequest = function(method, url) {
		var xhr;
		xhr = new XMLHttpRequest();
		if (xhr.withCredentials != null) {
			xhr.open(method, url, true);
		} else if (typeof XDomainRequest !== "undefined") {
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} else {
			xhr = null;
		}
		return xhr;
	};

	//To get the signed URL
	S3Upload.prototype.getSignedUrl = function(file, callback) {
		var self, xhr;
		self = this;
		xhr = new XMLHttpRequest();
		xhr.open('GET', this.signUrl + '?objectType=' + file.type + '&objectName=' + file.name + '&folderName=123', true);

		//Internet explorer doesn't support this
		if(xhr.overrideMimeType) xhr.overrideMimeType('text/plain; charset=x-user-defined');

		xhr.onreadystatechange = function(e) {
			var result;
			if (this.readyState === 4 && this.status === 200) {
				try {
					result = JSON.parse(this.responseText);
				} catch (error) {
					self.onError('Signing server returned some ugly/empty JSON: "' + this.responseText + '"');
					return false;
				}
				return callback(result.signedRequest, result.url);
			} else if (this.readyState === 4 && this.status !== 200) {
				return self.onError('Could not contact request signing server. Status = ' + this.status);
			}
		};
		return xhr.send();
	};

	//Uploads the file to the signed URL
	S3Upload.prototype.uploadToS3 = function(file, url, publicUrl) {
		var self, xhr;
		self = this;
		xhr = this.createCORSRequest('PUT', url);


		if (!xhr) {

			this.onError('CORS not supported');

		} else {
			xhr.onload = function() {
				if (xhr.status === 200) {
					self.onProgress(100, 'Upload completed.');
					return self.onFinish(publicUrl);
				} else {
					return self.onError('Upload error: ' + xhr.status);
				}
			};

			xhr.onerror = function() {
				return self.onError('XHR error.');
			};

			xhr.upload.onprogress = function(e) {
				var percentLoaded;
				if (e.lengthComputable) {
					percentLoaded = Math.round((e.loaded / e.total) * 100);
					return self.onProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing.' : 'Uploading.');
				}
			};
		}

		xhr.setRequestHeader('Content-Type', file.type);
		xhr.setRequestHeader('x-amz-acl', 'public-read');
		return xhr.send(file);
	};

	//To be called by the cliente to upload a file
	S3Upload.prototype.uploadFile = function(file) {
		var self;
		self = this;
		
		return this.getSignedUrl(file, function(signedURL, publicURL) {
			return self.uploadToS3(file, signedURL, publicURL);
		});
	};

	return S3Upload;

})();

}).call(this);