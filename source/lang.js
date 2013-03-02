enyo.kindof = function(object, kind) {
    var ctor = object.ctor;
    while (ctor) {
        if (enyo.getObject(ctor.prototype.kindName) === enyo.getObject(kind)) {
            return true;
        }
        ctor = ctor.prototype.base;
    }
    return false;
};