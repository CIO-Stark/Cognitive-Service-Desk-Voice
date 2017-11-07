# Cognitive Service Desk Voice

## Sobre

> O CSD Voice é uma PoC para uma solução de Voz+Watson onde os usuários interagem com o sistema totalmente por fala.

No modelo inicial foi utilizado o [Twilio](twilio.com) para provisionamento de números de telefone e camada de interação com os servícos do Watson mas outros provedores de voz e SIP podem ser utilizados para a mesma solução após ajustes dos flows.

Para a transcrição de voz, foi utilizado API Speechweb do [CPqD](www.cpqd.com.br). 

Caso queira saber maiores detalhes sobre utilização das APIs e arquitetura, entrem em contato com os owners do repositório.


## Serviços WATSON do CSD Voice
 
> __Conversation__
Serviço Watson Conversation responsável por orquestrar o fluxo de conversação. 


> __Text to Speech__
Serviço Watson utilizado para transformar o texto transcrito para voz Brasileira

## Serviços de Terceiros
 
> __Twilio Phone__
Serviço do Twilio que provisiona um número de telefone que executa APIs remotas conforme os eventos gerados (números digitados, atendimento, hangup, etc).

> __SpeechWeb CPqD__
Serviço que faz a transcrição de áudios no idioma português. Para Token e detalhes da utilização, entrem em contato com owners do repositório.

## Setup / Pré Requisitos

1. git clone repository
2. No Bluemix, criar Application: Node SDK 
3. Criar serviço Texto to Speech
4. No diretório da aplicação, execute:

    ```script
    npm install
    ```

