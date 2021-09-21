CREATE OR REPLACE FUNCTION INSERT_LOG() RETURNS trigger 
LANGUAGE plpgsql
as $$
DECLARE
    v_old_data TEXT;
    v_new_data TEXT;
BEGIN
    if (TG_OP = 'UPDATE') then
        v_old_data := ROW(OLD.*);
        v_new_data := ROW(NEW.*);
        insert into LOG (ID, TIPO, TABELA, COMANDO, IP, DATA, VALORNOVO, VALORANT, USUARIO)   
        values (DEFAULT, TG_OP::TEXT, TG_TABLE_NAME::TEXT, current_query(),(select distinct pg_stat_activity.client_addr from pg_stat_activity where datname='db9f7549degn1u'), current_timestamp, v_new_data, v_old_data, (select id from usuario where logado = true));
        RETURN NEW;
    elsif (TG_OP = 'DELETE') then
        v_old_data := ROW(OLD.*);
        insert into LOG (ID, TIPO, TABELA, COMANDO, IP, DATA, VALORANT, USUARIO)  
        values (DEFAULT, TG_OP::TEXT, TG_TABLE_NAME::TEXT, current_query(), (select distinct pg_stat_activity.client_addr from pg_stat_activity where datname='db9f7549degn1u') , current_timestamp, v_old_data,(select id from usuario where logado = true));
        RETURN OLD;
    elsif (TG_OP = 'INSERT') then
        v_new_data := ROW(NEW.*);      
        insert into LOG (ID, TIPO, TABELA, COMANDO, IP, DATA, VALORNOVO, USUARIO)   
        values (DEFAULT, TG_OP::TEXT, TG_TABLE_NAME::TEXT, current_query(), (select distinct pg_stat_activity.client_addr from pg_stat_activity where datname='db9f7549degn1u') , current_timestamp, v_new_data, (select id from usuario where logado = true));
        RETURN NEW;
    else
        RAISE WARNING '[AUDIT.IF_MODIFIED_FUNC] - Other action occurred: %, at %',TG_OP,now();
        RETURN NULL;
    end if;
END;
$$



--Log usuário
CREATE trigger USUARIO_LOG
AFTER INSERT OR UPDATE OR DELETE ON USUARIO
FOR EACH ROW EXECUTE PROCEDURE INSERT_LOG();


