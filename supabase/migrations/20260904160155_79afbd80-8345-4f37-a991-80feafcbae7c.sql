
-- Editable site text (TR/EN/FR)
insert into public.site_content (key, group_name, label, kind, value_tr, value_en, value_fr, sort_order) values
('home_hero_eyebrow','home','Hero eyebrow','text','Bolu''dan tüm Türkiye''ye','From Bolu to all of Türkiye','De Bolu vers toute la Türkiye',1),
('home_hero_title','home','Hero title','text','İngilizce ve Fransızca kitaplar, özenle seçildi.','English and French books, intelligently curated.','Des livres anglais et français, sélectionnés avec soin.',2),
('home_hero_subtitle','home','Hero subtitle','textarea','Dünyanın en çok konuşulan kitapları, hızlı teslimat ve dürüst fiyatlarla.','The world''s most talked-about titles, with fast delivery and honest pricing.','Les titres les plus commentés au monde, livrés vite et à prix juste.',3),
('home_hero_cta','home','Hero button','text','Kataloğu keşfet','Explore the catalogue','Explorer le catalogue',4),
('home_hero_cta2','home','Hero secondary button','text','Çok satanlar','Best sellers','Meilleures ventes',5),
('home_why_title','home','Why section title','text','Neden LIVORA?','Why LIVORA?','Pourquoi LIVORA ?',6),
('home_newsletter_title','home','Newsletter title','text','Yeni kitaplardan ilk sen haberdar ol','Be first to know about new arrivals','Soyez informé en premier des nouveautés',7),
('home_newsletter_subtitle','home','Newsletter subtitle','textarea','Ayda bir, sadece gerçekten önemli kitaplar.','Once a month, only the titles that truly matter.','Une fois par mois, uniquement les titres qui comptent.',8),
('home_partners_title','home','Partners title','text','Kurucularımız ve ortaklarımız','Our founders & partners','Nos fondateurs et partenaires',9),
('footer_about','footer','Footer description','textarea','Türkiye''nin akıllı uluslararası kitapçısı. Bolu''dan gönderilen seçkin İngilizce ve Fransızca kitaplar.','The smart international bookstore for Türkiye. Curated English & French titles, shipped from Bolu.','La librairie internationale intelligente pour la Türkiye. Des titres anglais et français, expédiés de Bolu.',1),
('footer_rights','footer','Footer legal line','text','Tüm hakları saklıdır.','All rights reserved.','Tous droits réservés.',2),
('contact_title','contact','Contact title','text','LIVORA''ya merhaba deyin.','Say hello to LIVORA.','Dites bonjour à LIVORA.',1),
('contact_intro','contact','Contact intro','textarea','Siparişler, editoryal sorular, iş birlikleri ve destek için buradayız.','We are here for orders, editorial questions, business partnerships, and support.','Nous sommes là pour les commandes, les questions éditoriales, les partenariats et le support.',2),
('contact_email','contact','Email','text','yemelink@gmail.com','yemelink@gmail.com','yemelink@gmail.com',3),
('contact_phone','contact','Phone','text','+90 501 024 20 25','+90 501 024 20 25','+90 501 024 20 25',4),
('contact_address','contact','Address','text','Bolu, Türkiye','Bolu, Türkiye','Bolu, Türkiye',5),
('about_title','about','About title','text','Türkiye''nin akıllı uluslararası kitapçısı.','The smart international bookstore for Türkiye.','La librairie internationale intelligente pour la Türkiye.',1),
('about_p1','about','About paragraph 1','textarea','LIVORA, Bolu merkezli bağımsız bir kitapçıdır ve yeni İngilizce ve Fransızca kitaplarda uzmanlaşmıştır.','LIVORA is an independent bookstore based in Bolu, specialised in new English and French titles.','LIVORA est une librairie indépendante basée à Bolu, spécialisée dans les nouveautés anglaises et françaises.',2),
('about_p2','about','About paragraph 2','textarea','Şirket Stéphane Yemeli (ürün, teknoloji, marka) ve Nickel Feumo (finans, fiyatlama, tedarik) tarafından kuruldu.','The company is founded by Stéphane Yemeli (product, technology, brand) and Nickel Feumo (finance, pricing, supply).','La société est fondée par Stéphane Yemeli (produit, technologie, marque) et Nickel Feumo (finance, prix, approvisionnement).',3),
('founder_1_name','about','Founder 1 name','text','Stéphane Yemeli','Stéphane Yemeli','Stéphane Yemeli',4),
('founder_1_role','about','Founder 1 role','text','Kurucu ortak — Ürün & Teknoloji (YEMELINK)','Co-founder — Product & Technology (YEMELINK)','Cofondateur — Produit & Technologie (YEMELINK)',5),
('founder_2_name','about','Founder 2 name','text','Nickel Feumo','Nickel Feumo','Nickel Feumo',6),
('founder_2_role','about','Founder 2 role','text','Kurucu ortak — Finans & Tedarik (Algo Finance)','Co-founder — Finance & Supply (Algo Finance)','Cofondateur — Finance & Approvisionnement (Algo Finance)',7),
('product_why_title','product','Product "why" title','text','Bu kitabı neden seveceksiniz','Why you''ll like it','Pourquoi vous allez l''aimer',1),
('product_shipping_note','product','Product shipping note','textarea','Türkiye genelinde 2-4 iş günü içinde teslimat.','Delivered across Türkiye in 2-4 business days.','Livraison partout en Türkiye en 2 à 4 jours ouvrés.',2),
('checkout_bank_intro','checkout','Bank transfer intro','textarea','Ziraat Bankası havalesi ile TRY olarak ödeyin, ardından dekontunuzu yükleyin.','Pay by Ziraat Bankası transfer in TRY, then upload your receipt (dekont).','Payez par virement Ziraat Bankası en TRY, puis téléversez votre reçu (dekont).',1),
('checkout_proof_help','checkout','Receipt upload help','textarea','Dekontu yükleyin; ekibimiz ödemeyi onaylayınca siparişiniz hazırlanır.','Upload your receipt; we prepare your order as soon as the payment is confirmed.','Téléversez votre reçu ; nous préparons votre commande dès la confirmation du paiement.',2),
('checkout_pending_label','checkout','Pending payment status label','text','Ödeme doğrulanacak','Payment to verify','Paiement à vérifier',3),
('checkout_success_note','checkout','Order confirmation note','textarea','Siparişiniz alındı. Dekont doğrulandıktan sonra kargoya veriyoruz.','Your order is received. We ship as soon as your receipt is verified.','Votre commande est reçue. Nous expédions dès que votre reçu est vérifié.',4),
('bank_name','checkout','Bank name','text','Ziraat Bankası','Ziraat Bankası','Ziraat Bankası',5),
('bank_iban','checkout','IBAN','text','TR74 0001 0090 1078 7294 7050 01','TR74 0001 0090 1078 7294 7050 01','TR74 0001 0090 1078 7294 7050 01',6),
('bank_account_holder','checkout','Account holder','text','NIKEL BIENVENU FEUMO FOLENG','NIKEL BIENVENU FEUMO FOLENG','NIKEL BIENVENU FEUMO FOLENG',7)
on conflict (key) do nothing;

-- Currency rates editable from settings (public readable category)
insert into public.settings (key, value, label, category) values
('fx_rate_usd','0.0208','TRY to USD rate','commerce'),
('fx_rate_eur','0.0180','TRY to EUR rate','commerce')
on conflict (key) do nothing;

-- Super admins can manage staff roles from the control center
create policy "super admin manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(),'super_admin'))
  with check (public.has_role(auth.uid(),'super_admin'));

grant select, insert, update, delete on public.user_roles to authenticated;
grant select, insert, update, delete on public.site_content to authenticated;
grant select on public.site_content to anon;
