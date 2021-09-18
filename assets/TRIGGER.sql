--LOG
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
        values (DEFAULT, TG_OP::TEXT, TG_TABLE_NAME::TEXT, current_query(), pg_stat_activity.client_addr, current_timestamp, v_new_data, v_old_data, USUARIO);
        RETURN NEW;
    elsif (TG_OP = 'DELETE') then
        v_old_data := ROW(OLD.*);
        insert into audit.logged_actions (schema_name,table_name,user_name,action,original_data,query)
        values (TG_TABLE_SCHEMA::TEXT,TG_TABLE_NAME::TEXT,session_user::TEXT,substring(TG_OP,1,1),v_old_data, current_query());
        RETURN OLD;
    elsif (TG_OP = 'INSERT') then
        v_new_data := ROW(NEW.*);      
        insert into LOG (ID, TIPO, TABELA, COMANDO, IP, DATA, VALORNOVO, USUARIO)   
        values (DEFAULT, TG_OP::TEXT, TG_TABLE_NAME::TEXT, current_query(), pg_stat_activity.client_addr, current_timestamp, v_new_data, USUARIO);
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


