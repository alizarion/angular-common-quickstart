angular.module('T4HTML')
    .constant("CONFIG", {
        "URL": "http://localhost:8080/rest",
        "VERSION": "v1",
        "BEFORE_VERB":"before",
        "AFTER_VERB":"after"
    })
    .constant('NOTIFICATION_TYPE', {
        INFO: "INFO",
        WARNING: "WARNING",
        ERROR: "ERROR",
        SUCCESS: "SUCCESS",
        DISMISS: "DISMISS"
    })
    .constant('EVENT',{
        CREATE_CUSTOM_BLOCK:'EVENT_CREATE_CUSTOM_BLOCK'
    })
