$(function(){
    require.config({
        paths: {
            iscroll: 'iscroll'
        }
    });
    require( ['iscroll'], function(iscroll) {
       var myscroll=new iScroll("wrapper");
    });
});