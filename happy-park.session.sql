SELECT * FROM USUARIO
--alter table log alter column comando type varchar(700)

--select * from set_logado(3)


-- create or replace function set_logado(id integer) returns void
-- language plpgsql
-- as $$
-- DECLARE
--     test INTEGER;
-- begin

--     test := id;
--     if((select logado from usuario where usuario.id=test) = true) then
--         update usuario set logado = false where usuario.id = test;
--         return;
--     else
--         update usuario set logado = true where usuario.id = test;
--         return;
--     end if;
-- end;
-- $$



