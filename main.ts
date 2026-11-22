import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output',U=new Uint8Array(65536);
const V=new Uint8Array(256);
for(let o=0;o<8;o++)V[o]=1;
V[1]=2;V[2]=5;
for(let o=0x10;o<0x23;o++)if(o!==0x1f)V[o]=1;
for(let o=0x30;o<0x34;o++)V[o]=3;
V[0x34]=1;V[0x40]=1;V[0x41]=1;
for(let o=0x50;o<0x54;o++)V[o]=1;
let L=0;
function run(p,q){
 const n=p.length,D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256);
 let s=0,c=0,o=0,ip=0,pc=0,t=0,code=0;
 X:for(;;){
  if(t===1e6){code=10;break X}
  if(pc<0||pc>=n){code=9;break X}
  const op=p[pc],v=V[op];
  if(!v){code=5;break X}
  const im=v-1;
  if(pc+im>=n){code=9;break X}
  t++;
  const nx=pc+1+im;
  const bi=op>=0x10&&op<0x23&&op!==0x17&&op!==0x1b&&op!==0x1f;
  const po=op===7?3:op===3||op===4||op===0x17||op===0x1b||op===0x31||op===0x32||op===0x40||op===0x50||op===0x51||op===0x53?1:op===5||op===6||op===0x41||bi?2:0;
  const pu=op===6||op===7?3:op===4||op===5?2:op===1||op===2||op===0x40||op===0x52||bi||op===0x17||op===0x1b?1:0;
  if(s<po){code=2;break X}
  if(s-po+pu>256){code=3;break X}
  pc=nx;
  if(bi){
   const b=D[s-1],a=D[s-2];let r=0;
   if(op===0x10)r=a+b|0;
   else if(op===0x11)r=a-b|0;
   else if(op===0x12)r=Math.imul(a,b);
   else if(op===0x13){if(!b){code=4;break X}r=a===-2147483648&&b===-1?a:(a/b)|0}
   else if(op===0x14){if(!b){code=4;break X}r=b===-1?0:a%b|0}
   else if(op===0x15){if(!b){code=4;break X}r=Math.floor((a>>>0)/(b>>>0))|0}
   else if(op===0x16){if(!b){code=4;break X}r=(a>>>0)%(b>>>0)|0}
   else if(op===0x18)r=a&b;
   else if(op===0x19)r=a|b;
   else if(op===0x1a)r=a^b;
   else if(op===0x1c)r=a<<(b&31);
   else if(op===0x1d)r=a>>(b&31);
   else if(op===0x1e)r=a>>>(b&31)|0;
   else if(op===0x20)r=a===b?1:0;
   else if(op===0x21)r=a<b?1:0;
   else r=(a>>>0)<(b>>>0)?1:0;
   s-=2;D[s++]=r;continue X;
  }
  switch(op){
   case 0:code=0;break X;
   case 1:D[s++]=(p[nx-1]<<24)>>24;break;
   case 2:D[s++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
   case 3:s--;break;
   case 4:D[s]=D[s-1];s++;break;
   case 5:{const v=D[s-1];D[s-1]=D[s-2];D[s-2]=v;break}
   case 6:D[s]=D[s-2];s++;break;
   case 7:{const a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;break}
   case 0x17:D[s-1]=-D[s-1]|0;break;
   case 0x1b:D[s-1]=~D[s-1];break;
   case 0x30:case 0x31:case 0x32:{
    const rel=((p[nx-2]|p[nx-1]<<8)<<16)>>16;
    if(op===0x30)pc=nx+rel;
    else{const v=D[--s];if(op===0x31?v===0:v!==0)pc=nx+rel}
    break}
   case 0x33:
    if(c===64){code=7;break X}
    C[c++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
   case 0x34:
    if(!c){code=8;break X}
    pc=C[--c];break;
   case 0x40:{
    const a=D[s-1];
    if(a<0||a>255){code=6;break X}
    D[s-1]=M[a];break}
   case 0x41:{
    const a=D[s-1],v=D[s-2];
    if(a<0||a>255){code=6;break X}
    s-=2;M[a]=v;break}
   case 0x50:{
    const w=String(D[s-1]);
    if(o+w.length>65536){code=11;break X}
    s--;
    for(let i=0;i<w.length;i++)U[o++]=w.charCodeAt(i);
    break}
   case 0x51:
    if(o>=65536){code=11;break X}
    U[o++]=D[--s]&255;break;
   case 0x52:D[s++]=ip<q.length?q[ip++]:-1;break;
   case 0x53:code=D[--s]&255;break X;
  }
 }
 L=o;return code;
}
for(const id of readdirSync(I).sort()){
 const code=run(new Uint8Array(readFileSync(join(I,id,'program.bin'))),new Uint8Array(readFileSync(join(I,id,'input.bin'))));
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),U.subarray(0,L));
 writeFileSync(join(O,id,'exit.txt'),code+'\n');
}
