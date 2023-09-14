//! Selectors(okuma)

const ekleBtn = document.getElementById ('ekle-btn')
const gelirInput = document.getElementById ('gelir-input')
const ekleFormu = document.getElementById ('ekle-formu')

// Sonuç Tablosu
const gelirinizTd = document.getElementById ('geliriniz')
const giderinizTd = document.getElementById ('gideriniz')
const kalanTd = document.getElementById ('kalan')

// Harcama Formu
//? harcama formu (obje için ınputlar)
const harcamaFormu = document.getElementById ('harcama-formu')
const harcamaAlaniInput = document.getElementById("harcama-alani")
const tarihInput = document.getElementById("tarih")
const miktarInput = document.getElementById("miktar")

// Harcama Tablosu
const harcamaBody = document.getElementById('harcama-body')

// Temizle Butonu
const temizleBtn = document.getElementById('temizle-btn')




//! Variables

let gelirler = 0

let harcamaListesi = []





//! Events

// submit butonuna basıldığında devreye girer!
// prevent default'u kullanmamız için (e) kullanmamız gerekiyor.
// prevent default sayfa da veri girişi olduğunda hızlı bir şekilde gelip giden default davranışı engeller. formlar da çok kullanılır.

ekleFormu.addEventListener ('submit', (e) => {
e.preventDefault() //reload'u engeller

// girdiğin verileri number ile toplattırıyorsun. String eklemeyi engelledik
gelirler = gelirler + Number( gelirInput.value)

// key-value gibi düşün. Gelirlerin kalıcı olarak kalmasını sağlamak için local storage'a kopyalıyoruz.
// yazma-verilerin yazılması
localStorage.setItem('gelirler', gelirler)

// girilen verilerin silinmesi için kullanılır.
ekleFormu.reset()

// Değişiklikler sonuç tablosuna yazan fonksiyon
hesaplaVeGuncelle()

})






// Refresh edilen sayfada verilerin silinmemesi için kullanılır. Burda doğacak problem concatination'dır. Onu da engellemek içi, gelen değer string çünkü , number kullanırız.
// sayfa yüklendikten sonra çalışan Event. Localda ki event'ı oku ve DOM'a bas

window.addEventListener('load',  () => {
gelirler =  Number (localStorage.getItem('gelirler'))
// console.log(gelirler)
// localstorage'den harcama listesini okuyarak global array'e saklıyoruz.
harcamaListesi = JSON.parse (localStorage.getItem('harcamalar')) || []

// dönmekte ki amaç dom'a basmak
// Harcama dizisinin içindeki objeleri tek tek DOM'a yazıyoruz.
harcamaListesi.forEach((harcama) => harcamayiDomaYaz(harcama))


console.log(harcamaListesi)

// Tarihi güncel tutmak için
tarihInput.valueAsDate = new Date()

hesaplaVeGuncelle()
})


// harcama formu submit edildiğinde çalışır
harcamaFormu.addEventListener('submit', (e) => {
e.preventDefault()

// obje oluşturma
// gelen verilerin nerden geldiğine gidiyoruz. Inputlara
    // böyle yapmanın nedeni anlık olarak unique değer verdiği için.


    // yeni harcama bilgileri ile bir obje oluşturur
const yeniHarcama = { 

    id: new Date().getTime(), 
    tarih: tarihInput.value, 
    alan: harcamaAlaniInput.value,
    miktar: miktarInput.value, 

  

}
// yeni harcama objesini diziye ekle
harcamaListesi.push(yeniHarcama)

// diziyi locale basma(harcamalarımızı stringify ile gönderdik.) Dizinin son halini kalıcı hale getirmek için localstrorage'gönderiyoruz.
localStorage.setItem('harcamalar', JSON.stringify(harcamaListesi ))



// DOM'a Basma 5.aşama
// yeni harcama fonsiyonunu pas geçtik


harcamayiDomaYaz(yeniHarcama)

hesaplaVeGuncelle()




// formdaki verileri sil
harcamaFormu.reset()
tarihInput.valueAsDate = new Date()


})





//! Functions


// Değişiklikler sonuç tablosuna yazan fonksiyon
// BASMA, sayfa her yüklendikten sonra çalışan Event

const hesaplaVeGuncelle = () => {


const giderler = harcamaListesi.reduce(
(toplam,harcama) => toplam + Number(harcama.miktar), 0)


giderinizTd.innerHTML = giderler
gelirinizTd.innerHTML = gelirler
kalanTd.innerHTML = gelirler - giderler



}

 // Destructuring yaptık yani harcamayı
// const harcamayiDomaYaz = (yeniHarcama) => {
// 1.yol  const {id, miktar, tarih, alan } = yeniHarcama }

// 2.yol havada destructuring
// const harcamayıDomayaz = ({id, miktar, tarih, alan})

const harcamayiDomaYaz = ({ id, miktar, tarih, alan }) => {
    // üst üste eklenmesini engellemek için += verdik
harcamaBody.innerHTML +=
` <tr>
<td>${tarih}</td>
<td>${alan}</td>
<td>${miktar}</td>
<td><i id=${id} class='fa-solid fa-trash-can text-danger' type='button' ></i></td>
</tr> 
`
}


harcamaBody.addEventListener('click', (e) => {

 // console.log(e.target)
//  e.target bize bulunduğumuz yeri verir.
//  event bir sil butonundan geldiyse

if(e.target.classList.contains('fa-trash-can')) {
// DOM'dan ilgili row'u sildik
e.target.parentElement.parentElement.remove()

const id = e.target.id
console.log(id)
// dizideki ilgili objeyi silmemiz gerekiyor.

harcamaListesi = harcamaListesi.filter( (harcama) => harcama.id !=id )
// eşit değil mi !=

// silinmiş yeni dizi localstorage'a aktardık
localStorage.setItem('harcamalar', JSON.stringify(harcamaListesi))

// her satır silindikten sonra yeni değerleri hesapla ve dom'a yaz
hesaplaVeGuncelle()

    }
})


// ?temizle butonuna basıldığı zaman çalış
// temizle btn event
temizleBtn.addEventListener('click', () => {
 
// diziyi de silme(RAM daki harcama listesi)
harcamaListesi = []

// global değişken(ram de ki) gelirleri de silelim
gelirler = 0

// localstorage deki tüm verileri sil
localStorage.clear()
// harcamaları siliyor dom da ki
harcamaBody.innerHTML = ''

// sonuç tablosundaki (dom) gelir, gider ve kalan değerleri sil
hesaplaVeGuncelle()

    })


















    //! ***********NOTLAR*********

// ?   1.    Verileri refresh ettiğimizde kalıcı olmasını istiyorsak
//    a.) yazma(güncelleme)
//    localStorage.setItem('giderler', )

//    b.) Yazma(global değişken)
//    giderler = localStorage.getItem('giderler')
   
//    her açılışta(refresh'te) bu durumun yapılması gerekir. Çözüm için fonksiyon yazarız yada onload event'ını kullanırız.



// ? 2. Harcama Formu kısmı

// Harcama Formu kısmını oluşturmak için obje {} kullanırız. {id:, tarih:, miktar:, alan:,}, bu verileri array'a atıcağız[{}]. Silme işlemi için DOM'da uygun hareket etmek adına ID verilir. 2.olarak, local storage primmitivleri aktarabilir ancak array ve objeyi direkt stringleştiremiyor. Bunun için; verileri stringleştirerek göndermeliyiz. 

// Format: 
// 1.setleme işlemi:

// localStorage.setItem('harcamalar', JSON.stringfy(harcamalar/array-obje ismi) non-primitivi stringfy ile stringleştiriyoruz.

//2. okuma işlemi(get)
// JSON.parse(localStorage.getItems('harcamalar')), yazılan bu ifade ile, js ortamında metin i json'a döndürüyor. [{}, {}]

// Parse:metinden json'a döndürür.
// stringfy: array veya objeden string'e dönüştürür.


// ? 3.not bootstrap cursor pointer vermek
// bootstrap te cursor pointer vermek için type a button dersek vermiş oluruz 

//?   4.not
// filter,map,reduce immutable'dir. 
// Önce dom dan sonra array den sonra local storage den silme işlemi yaptık.


// ? 5.not  Local Storage'a ihtiyaç duyulmasının nedeni;
// Bunların hiç biri kalıcı olmazdı. Sayfa açılıp kapandığında. Çünkü kalıcı bellek kullanmasaydık, buraya girdiğimiz tüm değerler refresh yapıldığında veya kapandığında kaybolurdu çünkü uygulamaya yazdığımız herşey ram belleğe gidiyor.
