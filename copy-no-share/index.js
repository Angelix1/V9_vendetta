(function(i,t,d,n,r,a,u){"use strict";const{FormRow:l}=d.Forms,p=n.findByName("Icon"),s=n.findByProps("openLazy","hideActionSheet");n.findByProps("openURL","openDeeplink");const f=t.React.createElement(p,{source:a.getAssetIDByName("copy")}),y=r.before("openLazy",s,function(v){let[A,R]=v;R==="MediaShareActionSheet"&&A.then(function(m){const U=r.after("default",m,function(b,g){let[{syncer:c}]=b;t.React.useEffect(function(){return void U()},[]);let e=c.sources[c.index.value];Array.isArray(e)&&(e=e[0]);const B=e.sourceURI??e.uri,o=g?.props?.children?.props?.children;let I=o.find(function(L){return L.props?.label?.toLowerCase()=="share"});o[o.indexOf(I)]=t.React.createElement(l,{leading:f,label:"Copy Image Link",onPress:function(){s.hideActionSheet(),t.clipboard.setString(B),u.showToast("Copied User to clipboard",a.getAssetIDByName("toast_copy_link"))}})})})}),h=function(){return y()};return i.onUnload=h,i})({},vendetta.metro.common,vendetta.ui.components,vendetta.metro,vendetta.patcher,vendetta.ui.assets,vendetta.ui.toasts);
