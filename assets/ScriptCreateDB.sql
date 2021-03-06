-- -----------------------------------------------------
-- Table USUARIO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS USUARIO (
  ID SERIAL PRIMARY KEY,
  CPF BIGINT NOT NULL,
  NOME VARCHAR(70) NOT NULL,
  TELEFONE VARCHAR(20) NOT NULL,
  EMAIL VARCHAR(70) NOT NULL,
  SENHA VARCHAR(300) NOT NULL,
  NASCIMENTO TIMESTAMP NOT NULL,
  ADMIN BOOLEAN NOT NULL,
  FUNCIONARIO BOOLEAN NOT NULL,
  CIDADE VARCHAR(100) NOT NULL,
  UF VARCHAR(2) NOT NULL,
  CONSTRAINT CPF_UNIQUE UNIQUE (CPF),
  CONSTRAINT EMAIL_UNIQUE UNIQUE (EMAIL));



-- -----------------------------------------------------
-- Table HORARIOTRABALHO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS HORARIOTRABALHO (
  ID SERIAL PRIMARY KEY,
  HORAENTRADA TIMESTAMP NOT NULL,
  HORASAIDA TIMESTAMP NOT NULL,
  USUARIO INT NOT NULL,
  CONSTRAINT fk_HORARIOTRABALHO_USUARIO1
    FOREIGN KEY (USUARIO)
    REFERENCES USUARIO (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



-- -----------------------------------------------------
-- Table ATRACAOCATEG
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ATRACAOCATEG (
  ID SERIAL PRIMARY KEY,
  DESCRICAO VARCHAR(45) NOT NULL,
  SITUACAO VARCHAR(1) NOT NULL);



-- -----------------------------------------------------
-- Table ATRACAO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ATRACAO (
  ID SERIAL PRIMARY KEY,
  DESCRICAO VARCHAR(45) NOT NULL,
  CAPACIDADE INT NULL,
  ATRACAOCATEG INT NOT NULL,
  CONSTRAINT fk_atracoes_categoria_atracao1
    FOREIGN KEY (ATRACAOCATEG)
    REFERENCES ATRACAOCATEG (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



-- -----------------------------------------------------
-- Table TIPOPAGAMENTO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS TIPOPAGAMENTO (
  ID SERIAL PRIMARY KEY,
  NOME VARCHAR(45) NOT NULL);


-- -----------------------------------------------------
-- Table FINANCEIRO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS FINANCEIRO (
  ID SERIAL PRIMARY KEY,
  VALORTOTAL VARCHAR(45) NOT NULL,
  VALORPAGO VARCHAR(45) NOT NULL,
  DATA TIMESTAMP NOT NULL,
  SITUACAO VARCHAR(1) NOT NULL,
  TIPOPAGAMENTO INT NOT NULL,
  CONSTRAINT fk_financeiro_tipos_pagamento1
    FOREIGN KEY (TIPOPAGAMENTO)
    REFERENCES TIPOPAGAMENTO (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



-- -----------------------------------------------------
-- Table INGRESSO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS INGRESSO (
  ID SERIAL PRIMARY KEY,
  VALOR FLOAT NOT NULL,
  DESCRICAO VARCHAR(45) NOT NULL,
  NOME VARCHAR(45) NOT NULL);



-- -----------------------------------------------------
-- Table VENDINGRESSO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS VENDINGRESSO (
  ID SERIAL PRIMARY KEY,
  DATA TIMESTAMP NOT NULL,
  VALIDADE TIMESTAMP NOT NULL,
  VALORTOTAL FLOAT NOT NULL,
  QUANTIDADE INT NOT NULL,
  INGRESSO INT NOT NULL,
  USUARIO INT NOT NULL,
  FINANCEIRO INT NOT NULL,
  CONSTRAINT fk_venda_ingresso_plano_ingresso1
    FOREIGN KEY (INGRESSO)
    REFERENCES INGRESSO (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_venda_ingresso_usuario1
    FOREIGN KEY (USUARIO)
    REFERENCES USUARIO (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_VENDINGRESSO_FINANCEIRO1
    FOREIGN KEY (FINANCEIRO)
    REFERENCES FINANCEIRO (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



-- -----------------------------------------------------
-- Table PARQUE
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS PARQUE (
  ID SERIAL PRIMARY KEY,
  NOME VARCHAR(45) NOT NULL,
  CNPJ VARCHAR(45) NOT NULL,
  HRABERTURA TIMESTAMP NOT NULL,
  HRFECHADO TIMESTAMP NOT NULL,
  CIDADE INT NOT NULL);



-- -----------------------------------------------------
-- Table LOJACATEG
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS LOJACATEG (
  ID SERIAL PRIMARY KEY,
  DESCRICAO VARCHAR(45) NOT NULL,
  SITUACAO VARCHAR(45) NOT NULL);



-- -----------------------------------------------------
-- Table LOJA
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS LOJA (
  ID SERIAL PRIMARY KEY,
  CNPJ VARCHAR(14) NOT NULL,
  NOME VARCHAR(45) NOT NULL,
  LOJACATEG_ID INT NOT NULL,
  CONSTRAINT CNPJ_UNIQUE UNIQUE (CNPJ),
  CONSTRAINT fk_LOJA_LOJACATEG1
    FOREIGN KEY (LOJACATEG_ID)
    REFERENCES LOJACATEG (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



-- -----------------------------------------------------
-- Table PRODUTOCATEG
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS PRODUTOCATEG (
  ID SERIAL PRIMARY KEY,
  DESCRICAO VARCHAR(45) NOT NULL);


-- -----------------------------------------------------
-- Table PRODUTO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS PRODUTO (
  ID SERIAL PRIMARY KEY,
  DESCRICAO VARCHAR(45) NOT NULL,
  MARCA VARCHAR(45) NULL,
  LOJA_ID INT NOT NULL,
  PRODUTOCATEG_ID INT NOT NULL,
  CONSTRAINT DESCRICAO_UNIQUE UNIQUE (DESCRICAO),
  CONSTRAINT fk_PRODUTO_LOJA1
    FOREIGN KEY (LOJA_ID)
    REFERENCES LOJA (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_PRODUTO_PRODUTOCATEG1
    FOREIGN KEY (PRODUTOCATEG_ID)
    REFERENCES PRODUTOCATEG (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



-- -----------------------------------------------------
-- Table VENDA
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS VENDA (
  ID SERIAL PRIMARY KEY,
  DATA VARCHAR(45) NOT NULL,
  USUARIO INT NOT NULL,
  CONSTRAINT fk_VENDA_USUARIO1
    FOREIGN KEY (USUARIO)
    REFERENCES USUARIO (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



-- -----------------------------------------------------
-- Table VENDITEM
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS VENDITEM (
  ID SERIAL PRIMARY KEY,
  VALORUNIT FLOAT NOT NULL,
  QUANTIDADE FLOAT NOT NULL,
  PRODUTO INT NOT NULL,
  USUARIO INT NOT NULL,
  VENDA INT NOT NULL,
  CONSTRAINT fk_VENDITEM_PRODUTO1
    FOREIGN KEY (PRODUTO)
    REFERENCES PRODUTO (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_VENDITEM_USUARIO1
    FOREIGN KEY (USUARIO)
    REFERENCES USUARIO (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_VENDITEM_VENDA1
    FOREIGN KEY (VENDA)
    REFERENCES VENDA (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table LOG
-- -----------------------------------------------------    
CREATE TABLE IF NOT EXISTS LOG (
  ID SERIAL PRIMARY KEY,
  TIPO VARCHAR(20) NOT NULL,
  TABELA VARCHAR(45) NOT NULL,
  COMANDO VARCHAR(700) NOT NULL,
  IP VARCHAR(15) NOT NULL,
  DATA TIMESTAMP NOT NULL,
  USUARIO INT NOT NULL,
  VALORNOVO VARCHAR(500),
  VALORANT VARCHAR(500),
  CONSTRAINT fk_LOG_USUARIO_USUARIO1
    FOREIGN KEY (USUARIO)
    REFERENCES USUARIO(ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION) 
