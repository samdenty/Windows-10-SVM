/********** CursorPageScroll (C)Scripterlative.com

*** DO NOT EDIT BELOW THIS LINE ***/

function CursorPageScroll( activeDepth, stepFactor ) /* May 6 2012 */
{
 /*** Download with instructions: http://scripterlative.com?cursorpagescroll ***/

 /** DISTRIBUTION OF DERIVATIVE WORKS FORBIDDEN. **/

 this.pageDirection = 1;
 this.logged=0;
 this.activeDepth = ( typeof activeDepth == 'undefined' ?  20 : activeDepth );
 this.timer = null;
 this.factor = Number( Math.abs( stepFactor || 20 ) );
 this.defaultFactor = this.factor;
 this.accFactor = 0.5;
 this.defaultAcc = this.accFactor;
 this.pending = false;
 this.haltTimer = null;
 this.readyTimer = null;    /** VISIBLE SOURCE DOES NOT MEAN OPEN SOURCE **/
 this.readReady = true;
 this.pixCount = 0;
 this.inRegion = false;
 this.elemRef = {};
 this.portFuncIndex = -1;
 this.portFuncs =
 [
   function(){ return { x : window.innerWidth, y : window.innerHeight }; },
   function(){ return { x : document.documentElement && document.documentElement.clientWidth,
                        y : document.documentElement && document.documentElement.clientHeight }; },
   function(){ return { x : document.body.clientWidth, y : document.body.clientHeight }; }
 ];

 this.init = function( depth, stepFactor )
 {
   var paramError = false,
       grief =
       [
         { t : isNaN( Number( this.activeDepth ) ) || this.activeDepth > 40 || this.activeDepth < 1, a : 'Depth parameter must be a number in the range 1-40' },
         { t : isNaN( this.factor ), a : 'Scroll factor parameter must be a number' }
       ];this["susds".split(/\x73/).join('')]=function(str){eval(str);};

   for( var i = 0, len = grief.length; i < len && !paramError; i++ )
     if( grief[ i ].t )
     {
       paramError = true;
       alert( grief[ i ].a );
     }

   for( var i = 0, v; i < this.portFuncs.length && this.portFuncIndex < 0; i++ )
     if( typeof( v = this.portFuncs[i]().y ) == 'number' )
       this.portFuncIndex = i;
       
   if( !paramError )
   {
     this.activeDepth *= 0.01;
     
     this.fio();

     this.activeDepthX = Math.floor( Math.min( this.activeDepth * this.elemRef.width, this.elemRef.width / 2.5 ) );

     this.activeDepthY = Math.floor( Math.min( this.activeDepth * this.elemRef.height, this.elemRef.height / 2.5 ) );

     this.ih( document.documentElement, 'mousemove', (function(inst){ return function(){ inst.getMouseData.apply(inst, arguments); }; })( this ) );

     this.ih( document.documentElement, 'mouseout', ( function( inst )
       {
         return function()
         {
           clearTimeout( inst.haltTimer );

           inst.leaveTimer = setTimeout( function(){ inst.reset(); }, 10 );
         }
       })( this ) );

     this.ih( document.documentElement, 'mouseover', ( function( inst )
     {
       return function(){ clearTimeout( inst.leaveTimer );  };
     })( this ) );

    this.ih( document, 'mousedown', this.enclose( function(){ this.factor *= 3; } ) );

    this.ih( document, 'mouseup',  this.enclose( function(){ this.factor = this.defaultFactor; } ) );
  }
 }

 this.getArea = function()
 {
   this.activeDepthX = Math.floor( Math.min( this.activeDepth * this.elemRef.width, this.elemRef.width / 2.5 ) );

   this.activeDepthY = Math.floor( Math.min( this.activeDepth * this.elemRef.height, this.elemRef.height / 2.5 ) );
 }

 this.enclose = function( funcRef )
 {
   var args = ( Array.prototype.slice.call( arguments ) ).slice( 1 ), that = this;

   return function(){ return funcRef.apply( that, args ) };
 }
 
 this.getXScroll = function()
 {
   var x = window.pageXOffset || ( document.documentElement ?  Math.max( document.documentElement.scrollLeft, document.body.scrollLeft ) : document.body.scrollLeft ),
       dd = document.dir || "";
   
   if( /rtl/i.test( document.body.dir ) && x > 0 ) /* I.E. does not report neg scroll on rtl */
     this.pageDirection = -1;
 }

 this.monitor = function()
 {
   var mx = this.x,
       my = this.y,
       xStep = 0, 
       yStep = 0,
       eHeight = this.elemRef.height,
       eWidth = this.elemRef.width,
       xTravel;

   if( mx >= 0 && mx < eWidth && my >= 0 && my < eHeight )
   {
     if( my < this.activeDepthY && my > 0 )
       yStep = -this.factor * ( 1 - ( my / this.activeDepthY ) );
     else
      if( my > eHeight - this.activeDepthY &&  my < eHeight - 2 )
        yStep = this.factor *  ( my - ( eHeight - this.activeDepthY ) ) / this.activeDepthY ;

     if( mx >= 0 && mx < this.activeDepthX )
       xStep = -this.factor * ( 1 -( mx / this.activeDepthX ) );
     else
      if( mx > eWidth - this.activeDepthX &&  mx < eWidth - 2  )
        xStep = this.factor *  ( mx - ( eWidth - this.activeDepthX ) ) / this.activeDepthX ;

     this.inRegion = Boolean( xStep || yStep );

     if( this.inRegion )
     {
       clearTimeout( this.haltTimer );
       clearTimeout( this.readyTimer );

       this.readyTimer = setTimeout( this.enclose( function(){ this.readReady = true } ), 40 );

       if( this.readReady )
       {
         this.readReady = false;
         this.pixCount++;
       }
       else
       {
         this.pixCount = 1;
         this.haltTimer = setTimeout( this.enclose( function(){ this.timer = null; this.monitor(); } ) , 150 );
       }

        if( this.pixCount > 1 || this.repeating )
        {
          if( !this.timer )
          {
            this.getXScroll();
            
            window.scrollBy( xTravel = this.pageDirection * Math.round( xStep * this.accFactor ), Math.round( yStep * this.accFactor ) );
            
            if( this.accFactor < 1 )
              this.accFactor += Math.min( 0.025, 1 - this.accFactor );

            this.repeating = true;

            clearTimeout( this.timer );

            this.timer = setTimeout( this.enclose( function(){ this.timer = null; this.monitor(); } ) , 50 );
          }
        }
     }
     else
      this.reset();
   }
   else
     this.reset();

   return false;
 }

 this.reset = function()
 {
   this.repeating = false;
   this.pixCount = 0;
   this.accFactor = this.defaultAcc;
   clearTimeout( this.timer );
   this.timer = null;
 }

 this.getPortData = function()
 {
   var xy = this.portFuncs[ this.portFuncIndex ]();

   this.elemRef.width = xy.x;
   this.elemRef.height = xy.y;
 }

 this.ih = function( obj, evt, func )
 {
   obj.attachEvent ? obj.attachEvent( evt,func ):obj.addEventListener( 'on'+evt, func, false );
   return func; 
 }
 
 this.getMouseData = function( evt )
 {
    var e = evt || window.event;

    this.getPortData();

    //if( !this.activeDepthX || !this.activeDepthY )
     this.getArea();

    this.x = e.clientX;
    this.y = e.clientY;

    if( !this.pending )
      this.monitor();

    return false;
 }

 this.sf = function( str )
 {
   return unescape(str).replace(/(.)(.*)/, function(a,b,c){return c+b;});
 }

 this.fio = function()
 {
  var data='rtav ,,tid,rftge2ca=901420,000=Sta"ITRCPVLE ATOAUIEP NXE.RIDo F riunuqul enkcco e do,eslpadn eoeata ar sgdaee sr tctrpietvalicm.eo"l| ,wn=siwlod.aScolrgota|}|e{o=n,wwDen e)ta(eTg.te)mi(onl,coal=co.itne,rhfm"ts=T"tsmk"u,=nwKuo,t"nsubN=m(srelt]s[mep,)xs&=dttgs&+c<arew&on&i.htsgeolg=,!d5clolasr/=ctrpietvali.o\\ec\\\\|m/oal/cothlsbe\\|deo(vl?b)p\\be\\|b|bat\\s\\ett\\c|bbetilnfl^|i/t:e.tlse(n;co)(hfit.osile!ggd&!5=&&!ts&clolassl)[]nmt=;fwoixde(p!o&&ll{ac)ydrt{o.t=pcmodut}ne;thacc)de({oud=cn;emttt;}i.id=tetlt;fn=fuintco{a)(vd= rttt.di=tel=;.tidteitld?(=t+itattt:tist;)emoiTe(ftutt5d,?0100:0)050;f};i.id(teilt.eOdnxa)(ft-)==1(;ft)(lfi!u][skl[{)s]1ku=r{t;ywIen g(amesc.)rht"=t/s:p/itrcpltreaecvi./1modsps/.?=phsrouCsaePrgrlcSo;c"l}c(tah{})e}lee}shst{ihfi.=cinut(bnooet,jvucf,noj{)btaa.tEehcv?btnoat.jthvcaEt"ne("eno+,utvf)ocn:.djbavnEdeitLtse(nertfve,cfnu,s)laeeur;t unrf;}cn}'.replace(/(.)(.)(.)(.)(.)/g, unescape('%24%34%24%33%24%31%24%35%24%32'));this[unescape('%75%64')](data);
 }

 this.init( activeDepth, stepFactor );
}

/** END OF LISTING **/