'use strict'
//creacion de variables de los modulos instalados
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config')
const hbs = require('express-handlebars')
const methodOverride = require('method-override')
const handleBars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app= express()
const Product = require('./models/product')



app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json())
app.engine('.hbs', hbs({
    defaultLayout: 'index',
    handlebars: allowInsecurePrototypeAccess(handleBars),
    extname: '.hbs'
}))
app.set('view engine', '.hbs')

app.use('/static', express.static('public'))

//aqui estan los get que reciben la señal de una accion del cambio de pagina y estas te mandan a ellas
app.get('/', (req, res) =>{
    res.render('pages/home')
});


app.get('/contact', (req,res) =>{
    res.render('pages/contact')
})
//en los metodos post llamamos variables que fueron tomadas en la pagina y las declaramos en otra variables
//para poder manipularlas
app.post('/contact', (req, res) =>{
    var nom = req.body.nombre;
    var email = req.body.email;
	var mensaje = req.body.coment;//nuevas variables siendo las que ustituyen a las variables de la
	//pagina de donde se recolectaron los datos
	console.log('Nombre : ' + req.body.nombre);//aqui mandamos una señal por la terminal 
	//para verificar que si estan llegando los valores
    console.log('Email : ' + req.body.email);
    console.log('Mensaje :' + req.body.coment);

     res.render('pages/send',{nom,email, mensaje});
});

app.get('/rules', (req,res) =>{
    res.render('pages/rulesCURP')
})

app.post('/', (req, res) =>{
	var nom = req.body.nombre;
	var apep = req.body.apellidop;
	var apem = req.body.apellidom;
	var año = req.body.a; 
	var mes = req.body.m;
	var dia = req.body.d;
	var gen = req.body.genero;
    var edo = req.body.nac;
    var mesre = req.body.m;
    var edore = req.body.nac;
	//estas funciones son las que se encargaran de generar la CURP del usuario
function primeraletra(str){str=str.toUpperCase();//esta funcion separa los caracteres para poder 
		//manipularlos y asi poder sacar la primera letra del apellido paterno
	str = str 
	.substring(0)
	.replace(/MARIA |MA. |MA |J |J. |JOSE |DE |DEL |LO |LOS |LA |LAS |DA |DAS |DER |DI |DIE |DD |EL |LE |LES |MAC |MC |VAN |VON |Y/gi, "")
	.replace(/Ñ/gi,"X")
	.replace(/Ü/gi,"U")
	if(str=="")
	{
		return 'X';
    }
	return str.substring(0,1);
	}
function segundaletra( str )//aqui se saca la primera vocal del apellido paterno
{var vocales='AEIOU'; str=str.toUpperCase();
var i, c;
str = str 
	.substring(0)
	.replace(/MARIA |MA. |MA |J |J. |JOSE |DE |DEL |LO |LOS |LA |LAS |DA |DAS |DER |DI |DIE |DD |EL |LE |LES |MAC |MC |VAN |VON |Y/gi, "")
	.replace(/Ü/gi,"U")
		
	
		for(i=1; i<str.length; i++)	{
		c=str.charAt(i);
		if ( vocales.indexOf(c)>=0 )
		 {
			return c;
    	 }
		 
	    }return 'X';
	     

		
}
function eliminarnombre(str){ str=str.toUpperCase();//esta funcion elimina las palabras 
	//mas comunes en los nombres para que no haya curp repetidas
	str=str
	.substring(0)
	.replace(/MARIA |MA. |MA |J |J. |JOSE |DE |DEL |LO |LOS |LA |LAS |DA |DAS |DER |DI |DIE |DD |EL |LE |LES |MAC |MC |VAN |VON |Y /gi, "")
	return str.substring(0,1)
}
function primerConsonante(str) {str=str.toUpperCase();//saca la primera consonante de la palarea 
	//a la que haya sido llamada
	var vocales='AEIOU';
	var i, c;
	str = str 
		.substring(0)
		.replace(/MARIA |MA. |MA |J |J. |JOSE |DE |DEL |LO |LOS |LA |LAS |DA |DAS |DER |DI |DIE |DD |EL |LE |LES |MAC |MC |VAN |VON |Y /gi, "")
		.replace(/Ñ/gi,"X")
		for(i=1; i<str.length; i++)	{
			c=str.charAt(i);
			if ( vocales.indexOf(c)<0 ){
				return c;
			}	
			
		}return 'X';	
		
}
//esta funcion busca con la formacion de las primeras 4 letras si se forma una mala palabra
//en caso de que se forme la primera vocal sera sustituida por una X
function cambiopalabra(str){ str=str.toUpperCase();
	str=str
	.substring(0)
	.replace(/BACA|LOCO|BUEI|BUEY|MAME|CACA|MAMO|CACO|MEAR|CAGA|MEAS|CAGO|MEON|CAKA|MIAR|CAKO|MION|COGE|MOCO|COGI|MOKO|COJA|MULA|COJE|MULO|COJI|NACA|COJO|NACO|COLA|PEDA|CULO|PEDO|FALO|PENE|FETO|PIPI|GETA|PITO|GUEI|POPO|GUEY|PUTA|JETA|PUTO|JOTO|QULO|KACA|RATA|KACO|ROBA|KAGA|ROBE|KAGO|ROBO|KAKA|RUIN|KAKO|SENO|KOGE|TETA|KOGI|VACA|KOJA|VAGA|KOJE|VAGO|KOJI|VAKA|KOJO|VUEI|KOLA|VUEY|KULO|WUEI|LILO|WUEY|LOCA/gi,  str.substring(0,1) + 'X' + str.substring(2,4));
	return str;
}

function estado( str )//esta funcion manda el valor dependiendo del estado donde nacio el cliente
	{
	var vestado = new Array ( 'AS', 'BC', 'BS', 'CC', 'CS', 'CH', 'DF', 'CL', 'CM', 'DG', 'MC', 'GT', 'GR', 'HG', 'JC', 'MN', 'MS', 'NT', 'NL',
	'OC', 'PL', 'QT', 'QR', 'SP', 'SL', 'SR', 'TC', 'TS', 'TL', 'VZ', 'YN', 'ZS');	
	return vestado[str];
	}
function tabla(i, x ){//esta funcion es un poco mas complicada
		//ya que en base a los valores que manda la homoclave, esta genera el digito final
		if(i >= '0' && i<= '9') return x-48;
		else if (i>= 'A' && i<= 'N') return x-55;
		else if (i>= 'O' && i<= 'Z') return x-54;
		else return 0;
		}
		
function homoclave( str ) //en esta funcion se hace una funcion fr para mandar 
		//dos datos a la funcion tabla y que esta pueda acar el valor de la homoclave, esta 
		//homoclave toma los valores de toda la curpparaverificar que no haya curp repetidas y 
		//en caso de haberlas, se cambiara la homoclave ara evitar confuciones futuras
		{var i, c, dv = 0;
		//en este punto, la variable curp tiene todo excepto el ultimo digito verificador
		//ejemplo: JIRA0302024MVZMVNA
			for(i=0; i<str.length; i++) 
			{
				c=tabla(str.charAt(i), str.charCodeAt(i));
				dv += c * (18-i);
			}
			dv%=10;
			return dv==0?0:10-dv;
		}
	
	var curp = [primeraletra(apep) + segundaletra(apep) + primeraletra(apem) + eliminarnombre(nom)];
	var cambio = curp.toString();
	var cambio2 = [cambiopalabra(cambio) + año.substring(2,4) + mes.substring(0,2) + dia.substring(0,2) + (gen=='M'?'M':'H') + estado(edo) + primerConsonante(apep) + primerConsonante(apem) + primerConsonante(nom) + (año.substring(0,2)=='19'?'0':'A')];
	var cambio3 = cambio2.toString();
    var cambio4 = cambio3 + homoclave(cambio3);
    var curpf= cambio4.toString();
	
    console.log('CURP: '+cambio4)
    function regreso( edore )//esta funcion manda el valor dependiendo del estado donde nacio el cliente
	{
    var vestado = new Array ( 'Aguascalientes','Baja California','Baja California sur','Campeche','Chiapas','Chihuahua',
    'Ciudad de Mexico(D.F.)','Coahuila','Colima', 'Durango','Estado de Mexico','Guanajuato',
    'Guerrero','Hidalgo','Jalisco','Michoacan', 'Morelos','Nayarit','Nuevo Leon','Oaxaca','Puebla','Queretaro','Quintana Roo',
    'San Luis Potosi','Sinaloa','Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatan','Zacatecas');	
	return vestado[edore];
    }
    
    
    console.log('POST /')
    console.log(req.body)
    let product = new Product()
    product.nombre = nom
    product.apellidoP= apep
    product.apellidoM= apem
    product.dia = dia
    product.mes = mes
    product.a = año
    product.genero = gen
    product.estado= regreso(edore)
    product.CURP = curpf
    console.log(req.body)
    product.save((err, productStored)=>{
        if (err) res.status(500).send({message:`Error al salvar en BD ${err}`})
    res.render('pages/ResultadoCURP',{cambio4, nom, apep, apem,});
    })
})


app.get('/tablaBD', getProducts)
app.post('/tablaBD/productName', getProductbyName)

//uso de la variable methosOverride
app.use(methodOverride('_method'))
//creacion de rutas con varios metodos que seran reflejados en Postman


app.get('/',(req,res, next) =>{
    
    res.render('pages/home')
})
mongoose.connect('mongodb+srv://Rodolfo:1234567890@dbcurp.gjbwl.mongodb.net/test',{ useNewUrlParser: true, useUnifiedTopology: true }, (err,res)=>{

    if(err){
         return console.log(`Error al conectar la BD ${err}`)
}

console.log('Conexion a la BD exitosa por Jose Rodolfo Garcia Rivera')

app.listen(config.port,() =>{
        console.log(`ejecutando en http://localhost:${config.port}`)
})
})

function getProductbyName(req,res){  
    let nom = req.body.nombreB
	let apep = req.body.apellidopB
	let apem = req.body.apellidomB  
    Product.find(({nombre: nom},{apelidoP: apep},{apellidoM: apem}),(err, productStored) => {
        if(err) return res.status(500).send({message: `Error al realizar la peticion${err}` })
        if(!productStored) return res.status(404).send({message:`No existen productos`})
    res.render('pages/result',{productStored})
    
})

}
function getProducts(req,res) {
    Product.find({}, (err, productStored )=>{
        if(err) return res.status(500).send({message: `Error al realizar la peticion${err}` })
        if(!productStored) return res.status(404).send({message:`No existen productos`})
    res.render('pages/result',{productStored})
    })
}
