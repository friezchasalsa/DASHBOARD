var D={A:{budget:150000,impr:5000,klik:885,chat:129},B:{budget:150000,impr:5000,klik:1702,chat:394}};
var P={proyek:16,nilai:75000000};
var F={sebelum:994,sekarang:1288};
var nf=new Intl.NumberFormat("id-ID");
function rp(v){return "Rp"+nf.format(Math.round(v));}
function pc(v){return (v*100).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2})+"%";}
function agg(v){
  if(v==="all"){return {budget:D.A.budget+D.B.budget,impr:D.A.impr+D.B.impr,klik:D.A.klik+D.B.klik,chat:D.A.chat+D.B.chat};}
  return D[v];
}
var M=[
 {k:"ctr",l:"CTR",f:function(d){return d.klik/d.impr;},fmt:pc,hi:true,n:"Persentase tayangan yang diklik. Makin tinggi makin baik."},
 {k:"cpc",l:"Biaya per chat",f:function(d){return d.budget/d.chat;},fmt:rp,hi:false,n:"Anggaran dibagi jumlah chat. Makin rendah makin hemat."},
 {k:"chat",l:"Jumlah chat",f:function(d){return d.chat;},fmt:function(v){return nf.format(v);},hi:true,n:"Chat inquiry yang masuk dari tiap versi."},
 {k:"cvr",l:"Chat per klik",f:function(d){return d.chat/d.klik;},fmt:pc,hi:true,n:"Dari 100 klik, berapa yang berlanjut jadi chat."},
 {k:"cpk",l:"Biaya per klik",f:function(d){return d.budget/d.klik;},fmt:rp,hi:false,n:"Anggaran dibagi jumlah klik. Makin rendah makin hemat."}
];
var state={v:"all",m:"ctr"};
function kpis(){
  var d=agg(state.v),all=state.v==="all";
  var items=[
   ["Anggaran",rp(d.budget)],["Chat inquiry",nf.format(d.chat)],["Biaya per chat",rp(d.budget/d.chat)],["CTR",pc(d.klik/d.impr)],
   ["Proyek jadi",all?String(P.proyek):"—"],["ROAS minimum",all?(P.nilai/d.budget).toLocaleString("id-ID")+"x":"—"]
  ];
  document.getElementById("kpis").innerHTML=items.map(function(x,i){return '<div class="kpi'+(i===5&&all?' hero':'')+'"><small>'+x[0]+'</small><b>'+x[1]+'</b></div>';}).join("");
}
function chart(){
  var m=M.filter(function(x){return x.k===state.m;})[0];
  var vals={A:m.f(D.A),B:m.f(D.B)},max=Math.max(vals.A,vals.B)*1.15;
  var s='<svg viewBox="0 0 420 220" role="img" aria-label="Perbandingan '+m.l+' versi A dan B">';
  s+='<line x1="30" y1="185" x2="400" y2="185" stroke="var(--line)"/>';
  ["A","B"].forEach(function(k,i){
    var h=Math.max(2,vals[k]/max*150),x=70+i*170,dim=(state.v!=="all"&&state.v!==k);
    s+='<g opacity="'+(dim?0.3:1)+'"><rect x="'+x+'" y="'+(185-h)+'" width="100" height="'+h+'" rx="6" fill="var(--'+k.toLowerCase()+')"><title>Versi '+k+': '+m.fmt(vals[k])+'</title></rect>';
    s+='<text x="'+(x+50)+'" y="'+(185-h-8)+'" text-anchor="middle" font-weight="800" font-size="15">'+m.fmt(vals[k])+'</text>';
    s+='<text x="'+(x+50)+'" y="206" text-anchor="middle" class="mut" font-size="13">Versi '+k+'</text></g>';
  });
  s+='</svg>';
  document.getElementById("chart").innerHTML=s;
  var better=(vals.B>vals.A)===m.hi?"B":"A";
  document.getElementById("mnote").textContent=m.n+" Versi "+better+" lebih baik pada ukuran ini.";
  document.getElementById("mt").innerHTML=M.map(function(x){return '<button data-m="'+x.k+'" aria-pressed="'+(x.k===state.m)+'">'+x.l+'</button>';}).join("");
}
function funnel(){
  var d=agg(state.v),steps=[["Tayangan",d.impr],["Klik",d.klik],["Chat",d.chat]];
  if(state.v==="all"){steps.push(["Proyek jadi",P.proyek]);}
  var top=d.impr;
  document.getElementById("fsub").textContent=state.v==="all"?"Dari 10.000 tayangan jadi 16 proyek. Persentase di kanan adalah sisa dari tahap sebelumnya.":"Proyek dicatat untuk seluruh kampanye, jadi tahap ini tidak ditampilkan per versi.";
  document.getElementById("funnel").innerHTML=steps.map(function(s,i){
    var w=Math.max(0.5,s[1]/top*100),prev=i?s[1]/steps[i-1][1]:null;
    return '<div class="frow"><span>'+s[0]+'</span><div class="bar"><i style="width:'+w+'%"></i></div><em>'+nf.format(s[1])+(prev!==null?' · '+(prev*100).toLocaleString("id-ID",{maximumFractionDigits:1})+'%':'')+'</em></div>';
  }).join("");
}
function followers(){
  var g=F.sekarang-F.sebelum;
  document.getElementById("fol").textContent="Naik "+nf.format(g)+" pengikut ("+(g/F.sebelum*100).toLocaleString("id-ID",{maximumFractionDigits:1})+"%) setelah kampanye.";
  var mx=F.sekarang*1.15,s='<svg viewBox="0 0 320 150" role="img" aria-label="Pengikut sebelum dan sesudah kampanye"><line x1="20" y1="115" x2="300" y2="115" stroke="var(--line)"/>';
  [["Sebelum",F.sebelum,"--a"],["Sekarang",F.sekarang,"--b"]].forEach(function(x,i){
    var h=x[1]/mx*85,px=55+i*340/2.3;
    s+='<rect x="'+px+'" y="'+(115-h)+'" width="80" height="'+h+'" rx="5" fill="var('+x[2]+')"/><text x="'+(px+40)+'" y="'+(115-h-6)+'" text-anchor="middle" font-weight="800" font-size="14">'+nf.format(x[1])+'</text><text x="'+(px+40)+'" y="134" text-anchor="middle" class="mut" font-size="12">'+x[0]+'</text>';
  });
  document.getElementById("folchart").innerHTML=s+'</svg>';
}
function render(){kpis();chart();funnel();}
document.getElementById("ver").addEventListener("click",function(e){
  var b=e.target.closest("button");if(!b)return;state.v=b.dataset.v;
  Array.prototype.forEach.call(this.children,function(x){x.setAttribute("aria-pressed",x===b);});render();
});
document.getElementById("mt").addEventListener("click",function(e){
  var b=e.target.closest("button");if(!b)return;state.m=b.dataset.m;chart();
});
followers();render();
