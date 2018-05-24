# tollgate

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
##oracledb 安装建议
``` bash
1、首先监测本机的gcc是不是4.7及以上版本 如果不是按照以下的方式升级
1)下载gcc 4.8.5的压缩包
下载地址：wef http://ftp.gnu.org/gnu/gcc/gcc-4.8.5/gcc-4.8.5.tar.bz2
2)找个目录存放，并解压 
#tar -jxvf gcc-4.8.5.tar.bz2
3)进入目录，执行命令
这个神奇的脚本文件会帮我们下载、配置、安装依赖库，可以节约我们大量的时间和精力。
# cd  gcc-4.8.5　
# ./contrib/download_prerequisites (链接不到地址 修改etc/resolv.conf中nameserver为: 8.8.8.8)
4)建立一个目录供编译出的文件存放
# mkdir gcc-build-4.8.5
# cd gcc-build-4.8.5
5)生成Makefile文件
# ../configure -enable-checking=release -enable-languages=c,c++ -disable-multilib
6)执行make，此处耗时大约1小时
# yum groupinstall "Development Tools"(一定要执行这个命令)
# make
7)执行安装
# make install
8)完成后，测试
2 、安装nodejs
1）上传服务器可以是自己任意路径，目前我的放置路径为  cd /app/software/
2）解压上传（解压后的文件我这边将名字改为了nodejs，这个地方自己随意，只要在建立软连接的时候写正确就可以）
    ① tar -xvf   node-v6.10.0-linux-x64.tar.xz   
    ② mv node-v6.10.0-linux-x64  nodejs (这个步骤相当于给文件夹改名字)
    ③确认一下nodejs下bin目录是否有node 和npm文件，如果有执行软连接，如果没有重新下载执行上边步骤；
3）建立软连接，变为全局
  A：ln -s /app/software/nodejs/bin/npm /usr/local/bin/ 
   B: ln -s /app/software/nodejs/bin/node /usr/local/bin/
3、 安装oracle的instantclient
 1)解压下载的oracle的instantclient 文件
    unzip instantclient-basic-linux.x64-12.2.0.1.0.zip
 2)mkdir -p /opt/oracle 新建一个文件夹
 3)mv instantclient_12_2 /opt/oracle 把oralce的instantclient文件复制到文件夹中
4)sudo sh -c "echo /opt/oracle/instantclient_12_2 > /etc/ld.so.conf.d/oracle-instantclient.conf"
5)sudo ldconfig
6)export LD_LIBRARY_PATH=/opt/oracle/instantclient_12_2:$LD_LIBRARY_PATH
7)sudo mkdir -p /opt/oracle/instantclient_12_2/network/admin
4、 安装oracledb
npm install oracle/node-oracledb.git#v2.0.15
如果报gyp WARN EACCES user “root” does not have permission to access the dev dir的错误,按一下步骤进行处理
1)Make a directory for global installations:
mkdir ~/npm-global

2)Configure npm to use the new directory path:
npm config set prefix '~/npm-global'
3)Open or create a ~/.profile (or ~/.bash_profile etc) file and add this line (at the end of the file):
export PATH=~/npm-global/bin:$PATH
5、 安装pm2
 npm install pm2 -g 
6、启动服务
 pm2 start service.js
如果是服务器中的端口没有启动,在外部访问不到该服务,请按照如下步骤开启端口
1)　开放10000端口的解决步骤如下：　
　1、修改/etc/sysconfig/iptables文件(用vi命令修改该文件)，增加如下一行：　　
 -A RH-Firewall-1-INPUT -m state --state NEW -m tcp -p tcp --dport 10000 -j ACCEPT
重启 iptables 
 service iptables restart
　2、重启防火墙，这里有两种方式重启防火墙(如果防火墙已关闭,忽略此步骤)
a) 重启后生效
　　开启： chkconfig iptables on
　　关闭： chkconfig iptables off
b) 即时生效，重启后失效
　　开启： service iptables start
　　关闭： service iptables stop 　

 
