

PostgreSQL atau Postgres adalah sistem manajemen database objek-relasional open source. Postgres merupakan server basis data yang dapat menangani beban kerja yang tinggi. Postgres memiliki keunggulan yaitu mereplikasi database yang dapat digunakan untuk bertujuan mencadangkan data serta menyediakan server database dengan ketersediaan tinggi.

	IP	Keterangan
Master	10.0.1.4	Read and Write
Slave	10.0.1.5	Only Read

Lakukan Proses Instalasi PostgreSQL 9.6 dan Konfigurasi UFW Firewall pada server Master dan Slave.
A.	Instalasi PostgreSQL 9.6
Pada percobaan kali ini, versi PostgreSQL yang digunakan yaitu versi 9.6. Pada repository ubuntu hanya menyediakan PostgreSQL 9.5, sehingga harus menginstal versi terbaru dengan menggunakan repository berikut
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'

Masukan PostgreSQL 9.6  key ke system
wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -

Perlu melakukan sistem update dan upgrade repository dengan perintah
sudo apt-get update  
sudo apt-get upgrade

Selanjutnya, ke tahap penginstalan PostgreSQL 9.6 package dengan perintah
apt-get install -y postgresql-9.6 postgresql-contrib-9.6

Jika penginstalan telah selesai, lakukan perintah berikut untuk memulai otomatis pada saat boot time
systemctl enable postgresql

Secara default, PostgreSQL berjalan pada localhost (127.0.0.1) IP address dengan port 5432 pada Ubuntu, lakukan pengecekan menggunakan perintah berikut
netstat -plntu
 
PostgreSQL 9.6 telah berjalan pada sistem. Pada tahapan selanjutkan, konfigurasi password untuk pengguna postgres. Pada hak akses root, masuk ke postgres user maka dapat mengakses ke halaman postgres dengan perintah berikut
Su – postgres
psql

Lakukan perubahan password pada postgres user dan lakukan pengecekan info koneksi dengan postgres query berikut
\password postgres
\conninfo

 
Jika sesuai pada gambar diatas maka PostgreSQL 9.6 telah terinstal pada system, berfungsi dengan baik tanpa error, dan password pada postgres user telah berhasil diperbarui.

B.	Konfigurasi UFW Firewall
UFW  atau Uncomplicated Firewall memiliki fungsi untuk mengelola iptables firewall pada Ubuntu. UFW merupakan firewall standar alat konfigurasi untuk Ubuntu Linux.

Pertama install ufw pada Ubuntu repository dengan perintah
apt-get install -y ufw

Tambahkan layanan SSH dan PostgreSQL pada UFW dengan perintah berikut
ufw allow ssh
ufw allow postgresql
 
Akifkan UFW Firewall dan lakukan pengecekan status
ufw enable
ufw status

 

UFW Firewall telah terinstal dan layanan PostgreSQL telah berhasil ditambahkan.

C.	Konfigurasi Server Master
Server Master memiliki IP Address 10.0.1.4, dan layanan Postgres akan berjalan didalam IP tersebut dengan port default yaitu 5432. Server Master memiliki hak akses untuk Read dan Write ke database, dan perform streaming replikasi kepada Server Slave.
Pergi ke direktori konfigurasi Postgres '/etc/postgresql/9.6/main' dan edit file postgresql.conf dengan perintah berikut
cd /etc/postgresql/9.6/main/
nano postgresql.conf
 
Aktifkan baris ‘listen_addresses’ dan ubah value dengan IP Server Master yaitu ’10.0.1.4’
listen_addresses = '10.0.1.4'

Aktifkan baris ‘wal_level’ dan ubah value menjadi ‘hot_standby’
wal_level = hot_standby

Untuk sinkronisasi, akan menggunakan ‘local’ sinkronisasi. Aktifkan baris berikut dan ubah value menjadi ‘local’
synchronous_commit = local

Aktifkan archiving mode dan ubah value achive command menjadi ‘cp %p /var/lib/postgresql/9.6/main/archive/%f’
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/9.6/main/archive/%f'

Untuk konfigurasi ‘Replikasi’, karena hanya menggunakan 2 server yaitu Master dan Slave, maka aktifkan baris ‘wal_sender’ dan ubah value menjadi ‘2’, serta untuk ‘wal_keep_segments’ memiliki value ‘10’
max_wal_senders = 2
wal_keep_segments = 10

Untuk application name, aktifkan baris ‘synchronous_standby_names’ dan ubah value menjadi ‘ifus17’
synchronous_standby_names = 'ifus17'

Simpan file dan keluar dari editor.

Pada file postgresql.conf, archive mode telah aktif, maka harus membuat direktori baru untuk arsip. Buat direktori arsip, ubah hak akses dan ubah kepemilikan postgres user.
mkdir -p /var/lib/postgresql/9.6/main/archive/
chmod 700 /var/lib/postgresql/9.6/main/archive/
chown -R postgres:postgres /var/lib/postgresql/9.6/main/archive/

Selanjutnya, edit file pg_hba.conf untuk konfigurasi autentikasi 
nano pg_hba.conf

 Tambahkan kofigurasi berikut pada bagian baris akhir
# Localhost
host    replication     sister          127.0.0.1/32           md5
 
# IP address untuk MASTER
host    replication     sister          10.0.1.4/32            md5
 
# IP address untuk SLAVE
host    replication     sister          10.0.1.5/32            md5

Simpan file dan restart PostgreSQL
systemctl restart postgresql

PostgreSQL telah berjalan pada IP Address 10.0.1.4, lakukan pengecekan dengan perintah netstat
netstat -plntu



 

Selanjutnya buat user baru untuk replikasi. Pada percobaan ini user bernama ‘sister’ dengan password ‘sisterIFUS17’. Pastikan password yang digunakan aman. Masuk ke postgres user dan akses postgres front end menggunakan perintah psql
su - postgres
psql

Buat replikasi baru ‘sister’ dengan password ‘sisterIFUS17’ pada postgres query
CREATE USER sister REPLICATION LOGIN ENCRYPTED PASSWORD 'sisterIFUS17';

Lakukan pengecekan user baru dengan perintah ‘du’ maka akan menampilkan sister user dengan hak akses replikasi
\du

 
 
Jika sesuai pada gambar diatas, maka Konfigurasi Server Master telah selesai.





D.	Konfigurasi Server Slave
Server Slave memiliki IP Address 10.0.1.5 dan pada server ini hanya memiliki hak akses Read Permission pada database. Server Database Postgres akan berjalan pada IP ‘10.0.1.5’ bukan pada IP localhost.
Berhentikan layanan Postgres pada Server Slave dengan perintah berikut
systemctl stop postgresql

Pergi ke direktori konfigurasi Postgres ‘/etc/postgresql/9.6/main’, lalu edit konfigurasi pada file ‘postgresql.conf’.
cd /etc/postgresql/9.6/main/
nano postgresql.conf

Aktifkan baris ‘listen_addresses’ dan ubah value menggunakan IP Address Server Slave yaitu ’10.0.1.5’
listen_addresses = '10.0..1.5'

Aktifkan baris ‘wal_level’ dan ubah value menjadi ‘hot_standby’
wal_level = hot_standby

Untuk sinkronisasi, aktifkan baris synchronous commit dan ubah value menjadi ‘local’
synchronous_commit = local

Untuk konfigurasi replikasi, aktifkan max wal level dan ubah value menjadi ‘2’ karena hanya menggunakan 2 server. Lalu untuk wal keep segmens, ubah value menjadi ‘10’
max_wal_senders = 2
wal_keep_segments = 10

Aktifkan baris ‘synchronous standby names’ untuk application name dan ubah value menjadi ‘ifus17’
synchronous_standby_names = 'ifus17'

Aktifkan baris ‘hot standby’ untuk Server Slave dan ubah value menjadi ‘on’
hot_standby = on
Simpan file dan keluar dari editor.

E.	Replikasi Data dari Master ke Slave
Pada tahap ini akan mengganti direktori utama pada Server ‘SLAVE’ dengan data utama pada direktori Server ‘MASTER’
Pada Server ‘SLAVE’ dan akses Postgres
Su - postgres

Pergi ke direktori postgres data ‘main’ dan backup dengan mengubah nama direktori
cd 9.6/
mv main main-bekup

Buat ‘main’ direktori sebagai ‘postgres’ user dan pastikan memiliki hak akses seperti direktori main-bekup
mkdir main/
chmod 700 main/

Selanjutnya copy direktori utama dari Server Master ke Server Slave dengan perintah pg_basebackup, menggunakan sister user untuk copy data
pg_basebackup -h 10.0.15.10 -U sister -D /var/lib/postgresql/9.6/main -P --xlog

Ketika data telah selesai ditransfer, pergi ke direktori data utama dan buat file baru ‘recovery.conf’
cd /var/lib/postgresql/9.6/main/
nano recovery.conf

Tambahkan kofigurasi berikut kedalam file ‘recovery.conf’
standby_mode = 'on'
primary_conninfo = 'host=10.0.1.4 port=5432 user=sister password=sisterIFUS17 application_name=ifus17'
restore_command = 'cp /var/lib/postgresql/9.6/main/archive/%f %p'
trigger_file = '/tmp/postgresql.trigger.5432'

Simpan dan keluar, lalu ubah hak akses pada file dengan perintah berikut, dimana hanya pemiilik yang dapat mengakses Read dan Write pada kasus ini merupakan Server Master dan Server Slave tidak memiliki hak akses tersebut.
chmod 600 recovery.conf

 

Aktifkan PostgreSQL 0.6 pada Server Slave dan pastikan layanan Postgres berjalan pada IP Address ‘10.0.1.5’. Lakukan pengecekan pada netstat
systemctl start postgresql
netstat -plntu
 
 

Data transfer dan konfigurasi untuk Server Slave telah selesai.

F.	Pengujian
1.	Integritas Data
Untuk Proses Pengujian, perlu melakukan replikasi status pada PostgreSQL 9.6 dan membuat table baru pada Server Master.
Pada Server Master dan masuk ke Postgres user
su - postgres

Lihat replikasi status dengan menggunakan perintah berikut
psql -c "select application_name, state, sync_priority, sync_state from pg_stat_replication;"
psql -x -c "select * from pg_stat_replication;"

Maka akan menampilkan hasil sebagai berikut
 
Selanjutnya, buat table baru pada Server Master. Masuk ke postgres user pada Server Master
su - postgres
psql

Tambah table baru bernama ‘UASSisterIFUS’ dan masukkan data ke table dengan menjalankan Postgres queries
CREATE TABLE UASSisterIFUS (Anggota varchar(100));
INSERT INTO UASSisterIFUS VALUES ('Rama Edwinda Putra');
INSERT INTO UASSisterIFUS VALUES ('Asep Nurul Huda');

 
Selanjutnya masuk ke Postgres user pada Server Slave dan akses ‘psql’ 
su - postgres
psql

Cek data pada table  ‘UASSisterIFUS’ dengan Postgres query berikut
select * from UASSisterIFUS;

 
 
Maka akan menampilkan data yang sama pada Server Master, karena telah mereplikasi data dari Server Master ke Server Slave.

Melakukan Percobaan tambah data pada Server Slave dengan query berikut
INSERT INTO UASSisterIFUS VALUES ('Tugas telah Selesai');

 
Maka akan menampilkan pesan error ‘Cannot execute INSERT’ query pada Server Slave. Hal ini dikarenakan pada Server Slave hanya memiliki hak akses read sehingga tidak dapat melakukan perubahan maupun penambahan data seperti Server Master.

2.	Eksekusi data
Pada proses pengecekan eksekusi data, data yang diinputkan sebanyak 10.000.000 data yang disimpan didalam table test_id. Pada tahap ini akan memeriksa paket eksekusi yang tidak stabil, dimana  pentingnya mengetahui kinerja PostgreSQL, untuk melakukan tindakan lebih atau opsi mana yang harus dikenali masalah kinerja dan untuk mencari tahu apa yang sebenarnya terjadi di server.

Pertama membuat table dengan nama ‘test_id’ dimana pada table tersebut berisi generate id sebanyak 10.000.000
 

Melakukan pengecekan replikasi pada Server Slave untuk memastikan data berhasil di replikasi dari Server Master ke Server Slave.

 

Melakukan pengecekan eksekusi data sebanyak 10.000.000 data dengan menggunakan perintah berikut
explain (buffers true, timing true, analyze true, costs true) SELECT * FROM test_id WHERE id < 10000000;
 

Dari hasil pengecekan sebanyak 10.000.000 data maka didapatkan hasil mengenai analisis informasi query plan. Karena menggunakan perintah Explain dengan opsi Analyze, maka query akan di eksekusi dan akan memberikan informasi waktu mengenai proses yang dilakukan. (actual time=0.610..1490.845 rows=999999 loops=1) artinya dalam melakukan eksekusi pemindaian index 1 kali (nilai loop). Tedapat 999999 baris yang tereksekusi, dimana waktu yang dibutuhkan untuk melakukan eksekusi yaitu 1920.570 ms. Jika data berasal dari RAM (shared_buffers atau cache sistem file OS) semuanya akan berjalan lancar, dan runtimes akan berada dalam kisaran yang dapat diterima. Bahkan menjalankan query untuk kedua kalinya akan mempercepat proses eksekusi, tentu dipengaruhi oleh kecepatan koneksi server.


