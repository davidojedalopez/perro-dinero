---
title: Transacciones interbancarias y cámaras de compensación en el ecosistema mexicano
title_key: "transacciones_interbancarias"
description: ¿Qué hay detrás de una transacción interbancaria? ¿Quiénes participan? ¿Quién se lleva cuánto?
published_at: 2022-03-25
cover_path: img/posts/covers/transaccion_interbancaria_cover.jpg
cover_alt: Nina, acostada en la tierra.
tags: ['tarjeta de credito', 'crédito', 'credito', 'tarjeta de crédito', 'transacción mismo banco', 'interbancaria', 'camara de compensacion', 'titular de marca', 'mastercard', 'visa', 'prosa', 'e-global']
themes: []
newsletter_cta: true
---

{% from "embeddedPost.njk" import embedPost with context %}

<details open>
  <summary>
    Contenidos
  </summary>

[[toc]]

</details>

Ya escribí anteriormente cómo funcionan las transacciones con tarjeta de crédito cuando tanto el banco emisor (quien te dio la tarjeta) y el banco adquiriente (quien presta la terminal al negocio) son la misma institución.

Aquí te dejo ese post, por si te lo perdiste:

{{ embedPost('transacciones_mismo_banco') }}

Es importante entender las transacciones "mismo banco" antes de leer este post, te facilitará la vida.

En esta ocasión, hablaremos de las transacciones interbancarias. Ahora el banco emisor y el **banco adquiriente son diferentes**. ¿Qué tanto se puede complicar? Bastante.

***

Recordemos cómo empieza todo:

Vas a un café, pides un matcha latte grande, sin azúcar y con un shot extra de espresso. Pagas con tu tarjeta de crédito y todos felices y contentos.

Para ti, como cliente, **todo fue exactamente igual**. Y también lo fue para el negocio. Pero ahora hay un banco más en el mapa. Podríamos pensar que no se complica tanto; solo se ponen de acuerdo los bancos que participan y ya, ¿no?

No es tan sencillo.

Pero antes de irnos a los detalles, quiero aclarar que cuando me refiero a un "banco emisor" o "banco adquiriente" **no tienen que ser literalmente un banco**. Las fintechs también pueden emitir tarjetas, pero no todas son un banco. Y los agregadores de pago como Clip tienen Terminal Punto de Venta (TpV) y pueden aceptar pagos con tarjetas, pero tampoco son un banco. A lo largo de este post me referiré a emisores y adquirientes como bancos porque así es más fácil comprenderlo y así lo encontrarás en muchos documentos oficiales, como los de Banxico.

Ahora sí, vamos a ello. Está largo el post. Recomiendo una cerveza o un café antes de comenzar, dependiendo de la posición del sol.

## Comparación transacción mismo banco

Para poder hacer un contraste rápido, primero voy a mostrar el flujo de una transacción "mismo banco" y después el flujo de una transacción interbancaria:

{% image 'img/posts/transaccion_interbancaria/transaccion_mismo_banco.png', 'Transacción mismo banco' %}

Y ahora la transacción interbancaria:

{% image 'img/posts/transaccion_interbancaria/transaccion_interbancaria.png', 'Transacción interbancaria.' %}

**¿Notaste la diferencia?** En la transacción interbancaria hay dos participantes más: la **Cámara de Compensación de Pagos con Tarjeta**; y un banco adicional.

En la transacción mismo banco, el banco emisor y adquiriente eran el mismo.

En una transacción interbancaria participan dos bancos distintos. Y existe una entidad adicional entre esos dos bancos, la Cámara de compensación.

**¿Qué es una cámara de compensación? ¿Por qué es necesaria? ¿Cómo contribuye en este proceso?**

## Cámara de Compensación de Pagos con Tarjeta

Una cámara de compensación de pagos con tarjeta es una asociación o institución que se encarga de **hacer cumplir los pagos y liquidaciones entre bancos emisores y adquirientes**. Las cámaras de compensación para pagos con tarjeta también son conocidas como procesadores de pagos o switches.

Su principal función es evitar el riesgo de incumplimiento de las contrapartes en una transacción financiera.

Entonces, una cámara de compensación no es mas que un intermediario entre emisor y adquiriente que **asegura que cada quien reciba lo que le toca**. Este participante no tiene nada que ver con el tarjetahabiente ni con el negocio que usa la TpV, solo con emisor y adquiriente.

Este proceso de pagar a cada quien lo que le corresponda no ocurre al mismo tiempo que todo el flujo que experimentas como tarjetahabiente. Es decir, tú pagaste con tu tarjeta y, suponiendo que todo salió bien, te dieron tu café. Hasta este momento **ninguno de los participantes ha recibido nada** de sus cuotas o comisiones porque todavía no han sido liquidadas.

El tiempo en que ese dinero se ve reflejado en cada una de las cuentas varía dependiendo de la cámara de compensación y el banco adquiriente. Y el flujo de este proceso se ve así:

{% image 'img/posts/transaccion_interbancaria/compensacion_y_liquidacion.png', 'Proceso de compensación y liquidación.' %}

Dejemos de lado los detalles de las tarifas y cuotas por un momento, y hablemos un poco más de estas cámaras de compensación y su importancia en nuestro país.

### Ecosistema en México

Las dos cámaras de compensación predominantes en México por muchos años han sido E-Global y Prosa. Pero recientemente ya participan Mastercard ([autorizada en 2018](https://dof.gob.mx/nota_detalle.php?codigo=5546195&fecha=11/12/2018)) y Visa ([autorizada en 2020](https://www.dof.gob.mx/nota_detalle.php?codigo=5589495&fecha=17/03/2020)).

Es muy importante recalcar que la entrada de **nuevos competidores es buena para todo el ecosistema**. Tanto E-Global como Prosa son controladas por los grandes bancos de México: E-Global por BBVA, CitiBanamex y HSBC; y Prosa por Santander, Banorte, HSBC (también), Invex, Banjercito y Bank of Nova Scotia.

Que Visa y Mastercard ya puedan operar como cámaras de compensación significa que habrá **mayor competencia**, y, por lo tanto, mayor innovación y mejoras para nosotros, los tarjetahabientes, y también para todos los demás participantes.

Para ilustrar este punto, vamos hablando de las formas de autorización que pueden usar las TpV en transacciones físicas.

### Ejemplo de autorización

Antes, deslizabas la tarjeta por el lector magnético de la terminal para poder transaccionar. La terminal leía los datos de la tarjeta desde la banda magnética y transmitía esa información. Pero eso es inseguro, pues hay dispositivos diseñados especialmente para robarte esa información.

Luego, pasamos al chip y NIP. Ahora la mayoría de las terminales aceptan la lectura del chip y posterior validación con NIP para confirmar una compra. Es un nuevo modo de autorización que es más seguro que el anterior. Pero no todas las tarjetas y/o terminales permiten esta manera de autorización.

Y el tema es que para que una terminal pueda procesar cierto tipo de autorización, **toda la cadena debe poder hacerlo también**.

Es decir, la TpV del banco adquiriente debe poder leer el chip; el banco emisor debe aceptar ese método de autenticación; y la cámara de compensación debe poder transmitir correctamente esa información.

Imagina que un banco adquiriente tiene una TpV que acepta biométricos, como la huella digital. Y utiliza la cámara de compensación de Mastercard, que sabe transmitir la información biométrica de forma segura. Si el banco emisor de esa tarjeta no implementa autorización con biométricos todavía, entonces el tarjetahabiente no puede hacer uso de su huella digital para pagar porque alguien en la cadena todavía no sabe qué pedo.

De igual forma, si la cámara de compensación fuese quien no sabe cómo procesar cierta información, pues no importa si el banco emisor tiene las posibilidades de emplear tecnología más avanzada, no podrá porque alguien en la cadena de pagos no tiene la capacidad suficiente.

**Por eso es muy bueno que haya más opciones de cámaras de compensación**. Todavía hay un cierto nivel de monopolio en México por parte de los grandes bancos, pero al menos ya existe la competencia.

Ahora, a los dineros y sus cambios de mano.

## Tarifas y Cuotas

Hay varias mochadas en todo este flujo complejo de transacciones y participantes. Las principales son la Tasa de Descuento, Cuota de Intercambio y Cuotas por Ruteo, Compensación y Liquidación.

### 💰 **Tasa de Descuento**
La Tasa de Descuento es la comisión que cobra el banco adquiriente al negocio por el uso de su TpV, la cual hace posible que pueda aceptar pagos con tarjeta.

Esta comisión se cobra por cada transacción, y suele ser proporcional a la cantidad a cobrar. Y ese porcentaje también varía dependiendo del giro del negocio, si la tarjeta es de débito o crédito y de cualquier otro acuerdo entre el negocio y el proveedor de la TpV.

### 💰 **Cuota de Intercambio**

La Cuota de Intercambio es la comisión que cobra un banco emisor a un banco adquiriente cuando se efectúa una transacción interbancaria con tarjeta de crédito o débito.

¿Por qué la cobra el banco emisor? Porque es quien corre todo el riesgo de que el tarjetahabiente no pague sus deudas.

### 💰 **Cuotas por Ruteo, Compensación y Liquidación**

Son las cuotas fijas por transacción, o porcentaje del monto de la transacción, que las cámaras de compensación cobran a sus participantes y a otras cámaras de compensación a las que proporcionen los servicios de Ruteo, Compensación y Liquidación (imagina una transacción internacional que tiene que pasar por más de una cámara de compensación).

Si quisieras verlo **solo en términos de cuotas y comisiones**, sería así:

{% image 'img/posts/transaccion_interbancaria/cuotas.png', 'Cuotas y comisiones en transacción interbancaria.' %}

**En resumen, los saldos quedan así:**
- • El tarjetahabiente paga el importe de la compra.

- • El negocio recibe el importe de la compra, menos la Tasa de Descuento.

- • El banco adquiriente recibe la Tasa de Descuento menos la Cuota de Intercambio, menos la Cuota por Ruteo.

- • El banco emisor recibe la Cuota de Intercambio menos la Cuota por Ruteo.

- • La cámara de compensación recibe las Cuotas por Ruteo tanto del banco adquiriente como emisor.

Si alguna vez te preguntaste: ¿Cómo es que el banco gana dinero de mi tarjeta de crédito si soy totalero? ¡Y aparte me dan puntos! La respuesta es, principalmente, la **Cuota de Intercambio**.

**¿Y qué pasa con las marcas de las tarjetas? ¿De qué sirve que mi plástico diga "Mastercard" o "Visa"?** Eso se conoce como Titular de Marca.

## Titular de Marca

El Titular de Marca es quien otorga la licencia a los bancos emisores para utilizar cierta marca y estamparla en las tarjetas. Y tener esa estampa es lo que permite que tu tarjeta sea aceptada en muchas otras partes del mundo.

Cuando haces una compra en un negocio fuera del país, el titular de marca es quien da seguridad al negocio de que alguien va a liquidar la compra. Estas marcas tienen cámaras de compensación a nivel internacional, por eso te pueden aceptar una tarjeta que sea de un banco extranjero.

Algunos ejemplos de titulares de marca son Visa, Mastercard, American Express, Discover/Diners y Carnet (de Prosa). El hecho de que tu plástico tenga una de estas marcas te garantiza mayor aceptación en otras partes del mundo.

## Pa' cerrar

Con esto concluye este viaje astral que nos llevó a conocer más sobre las transacciones interbancarias y del rol de cada uno de sus participantes.

El sistema de pagos es complejo, y espero esta explicación te haya ayudado a comprenderlo mejor.

Gracias por leerme 💜