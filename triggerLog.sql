create or replace function public.handle_new_user()
returns trigger as $$
begin
  if not exists (
    select 1 from public.usuarios where id = new.id
  ) then
    insert into public.usuarios (
      id,
      correo,
      nombre,
      genero,
      telefono,
      avatar,
      rol,
      activo
    )
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data ->> 'full_name', 'Sin nombre'),
      coalesce(new.raw_user_meta_data ->> 'genero', 'Sin especificar'),
      coalesce(new.raw_user_meta_data ->> 'telefono', '000000000'),
      new.raw_user_meta_data ->> 'avatar_url',
      'usuario',
      true 
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;
