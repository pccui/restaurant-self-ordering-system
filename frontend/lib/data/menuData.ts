import { Menu } from '@restaurant/shared/src/schemas/menu'

export const menuData: Menu = [
  {
    "id": "1",
    "category": "sichuan",
    "priceCents": 2800,
    "tastes": [
      { "zh": "麻辣", "en": "Numbing and Spicy", "de": "Taub und Scharf" },
      { "zh": "鲜香", "en": "Umami and Aromatic", "de": "Umami und Aromatisch" }
    ],
    "ingredients": [
      { "zh": "嫩豆腐", "en": "Soft Tofu", "de": "Weicher Tofu" },
      { "zh": "牛肉末", "en": "Ground Beef", "de": "Hackfleisch" },
      { "zh": "豆瓣酱", "en": "Doubanjiang", "de": "Doubanjiang" },
      { "zh": "花椒", "en": "Sichuan Peppercorn", "de": "Szechuanpfeffer" },
      { "zh": "干辣椒", "en": "Dried Chili Pepper", "de": "Getrocknete Chili" }
    ],
    "thumbnailUrl": "/images/mapo-tofu-thumb.jpg",
    "imageUrl": "/images/mapo-tofu.jpg",
    "translations": {
      zh: {
        name: "麻婆豆腐",
        shortDescription: "川菜经典下饭菜，豆腐软嫩裹满鲜辣酱汁",
        detailedDescription: "由清代陈麻婆创制，被誉为“川菜灵魂”之一。豆腐选嫩豆腐焯水去豆腥味，牛肉末用郫县豆瓣酱煸炒出香，加高汤小火慢炖后勾芡收汁，撒花椒粉提香。成品色泽红亮，豆腐入口即化，需遵循“麻、辣、烫、嫩、酥、香、鲜”七字诀，花椒选四川汉源大红袍，辣味来自豆瓣酱与干辣椒融合。部分门店有制作短视频，展示豆腐切块、酱汁熬制细节"
      },
      en: {
        name: "Mapo Tofu",
        shortDescription: "A classic Sichuan dish that pairs well with rice, featuring soft tofu coated in a fresh and spicy sauce.",
        detailedDescription: "Created by Chen Mapo in the Qing Dynasty, it is known as one of the 'souls of Sichuan cuisine'. The dish uses soft tofu blanched to remove the bean odor, ground beef stir-fried with Pixian doubanjiang for fragrance, then simmered with stock and thickened with starch. The finished product is bright red, and the tofu melts in your mouth. It follows the seven-character principle of 'numbing, spicy, hot, tender, crispy, fragrant, and fresh'. Sichuan peppercorns from Hanyuan are used, and the spiciness comes from the fusion of doubanjiang and dried chili peppers. Some stores have production videos showing the cutting of tofu and the simmering of the sauce."
      },
      de: {
        name: "Mapo Tofu",
        shortDescription: "Ein klassisches Sichuan-Gericht, das gut zu Reis passt, mit weichem Tofu in einer frischen und scharfen Sauce.",
        detailedDescription: "Erfunden von Chen Mapo in der Qing-Dynastie, ist es als eine der 'Seelen der Sichuan-Küche' bekannt. Das Gericht verwendet weichen Tofu, der blanchiert wird, um den Bohnengeschmack zu entfernen, Hackfleisch, das mit Pixian-Doubanjiang geröstet wird, dann mit Brühe gekocht und mit Stärke gebunden. Das fertige Produkt ist hellrot, und der Tofu zergeht auf der Zunge. Es folgt dem Sieben-Charakter-Prinzip von 'taub, scharf, heiß, zart, knusprig, duftend und frisch'. Es werden Szechuanpfeffer aus Hanyuan verwendet, und die Schärfe kommt aus der Fusion von Doubanjiang und getrockneten Chilischoten. Einige Geschäfte haben Produktionsvideos, die das Schneiden von Tofu und das Köcheln der Sauce zeigen."
      }
    }
  },
  {
    "id": "2",
    "category": "sichuan",
    "priceCents": 8800,
    "tastes": [
      { "zh": "香辣", "en": "Spicy and Aromatic", "de": "Scharf und Aromatisch" },
      { "zh": "麻味", "en": "Numbing", "de": "Taub" }
    ],
    "ingredients": [
      { "zh": "草鱼/黑鱼", "en": "Grass Carp / Snakehead Fish", "de": "Graskarpfen / Schlangenkopf Fisch" },
      { "zh": "豆芽", "en": "Bean Sprouts", "de": "Sojabohnensprossen" },
      { "zh": "生菜", "en": "Lettuce", "de": "Kopfsalat" },
      { "zh": "干辣椒", "en": "Dried Chili Pepper", "de": "Getrocknete Chili" },
      { "zh": "花椒", "en": "Sichuan Peppercorn", "de": "Szechuanpfeffer" },
      { "zh": "豆瓣酱", "en": "Doubanjiang", "de": "Doubanjiang" }
    ],
    "thumbnailUrl": "/images/shuizhu-yu-thumb.jpg",
    "imageUrl": "/images/shuizhu-yu.jpg",
    translations: {
      zh: {
        name: "水煮鱼",
        shortDescription: "热油激香的鲜辣硬菜，鱼片滑嫩无刺",
        detailedDescription: "起源于重庆，属川菜“江湖菜”代表。选鲜活草鱼或黑鱼，片成薄鱼片用盐、料酒、蛋清腌制增滑嫩。配菜焯水铺盆底，鱼片煮熟覆盖其上，浇七成热红油激香。“水煮”实为“煮后淋油”工艺，锁鱼肉鲜味。食用建议先吃配菜再吃鱼，搭配冰镇酸梅汤解辣解腻，短视频展示鱼片厚度与菜品整体分量"
      },
      en: {
        name: "Water Boiled Fish",
        shortDescription: "A spicy and aromatic dish with fish slices that are tender and boneless, activated by hot oil.",
        detailedDescription: "Originating from Chongqing, it is a representative of Sichuan 'jianghu cuisine'. Fresh grass carp or snakehead fish is selected, sliced thinly and marinated with salt, cooking wine, and egg white for tenderness. The side dishes are blanched and placed at the bottom of the bowl, then the fish slices are cooked and placed on top, followed by pouring 70% hot red oil to activate the fragrance. 'Water boiling' actually refers to the process of boiling followed by oil pouring, which locks in the freshness of the fish. It is recommended to eat the side dishes first followed by the fish, paired with iced plum juice to relieve spiciness and grease. Short videos show the thickness of the fish slices and the overall portion of the dish."
      },
      de: {
        name: "Wasser Gekochter Fisch",
        shortDescription: "Ein scharfes und aromatisches Gericht mit zarten und grätenfreien Fischscheiben, aktiviert durch heißes Öl.",
        detailedDescription: "Ursprünglich aus Chongqing, ist es ein Vertreter der Sichuan 'Jianghu-Küche'. Frischer Graskarpfen oder Schlangenkopf Fisch wird ausgewählt, in dünne Scheiben geschnitten und mit Salz, Kochwein und Eiweiß mariniert, um Zartheit zu erreichen. Die Beilagen werden blanchiert und auf den Boden der Schüssel gelegt, dann werden die Fischscheiben gekocht und darauf platziert, gefolgt von 70% heißem rotem Öl, um den Duft zu aktivieren. 'Wasserkochen' bezieht sich eigentlich auf den Prozess des Kochens gefolgt von Ölgießen, der die Frische des Fisches einschließt. Es wird empfohlen, zuerst die Beilagen und dann den Fisch zu essen, begleitet von eisgekühltem Pflaumensaft, um Schärfe und Fettigkeit zu mildern. Kurzvideos zeigen die Dicke der Fischscheiben und die gesamte Portion des Gerichts."
      }
    }
  },
  {
    id: "3",
    category: "sichuan",
    priceCents: 4200,
    tastes: [
      { zh: "咸鲜", en: "Salty and Savory", de: "Salzig und Herzhaft" },
      { zh: "微辣", en: "Slightly Spicy", de: "Leicht Scharf" }
    ],
    ingredients: [
      { zh: "五花肉", en: "Pork Belly", de: "Schweinebauch" },
      { zh: "青椒", en: "Green Pepper", de: "Grüner Pfeffer" },
      { zh: "蒜苗", en: "Garlic Sprouts", de: "Knoblauchsprossen" },
      { zh: "郫县豆瓣酱", en: "Pixian Doubanjiang", de: "Pixian Doubanjiang" },
      { zh: "甜面酱", en: "Sweet Bean Paste", de: "Süße Bohnenpaste" }
    ],
    thumbnailUrl: "/images/huiguo-rou-thumb.jpg",
    imageUrl: "/images/huiguo-rou.jpg",
    translations: {
      zh: {
        name: "回锅肉",
        shortDescription: "咸香微辣的家常菜，肉片香糯不腻",
        detailedDescription: "因肉片先煮后炒“回锅”得名，属川菜“咸鲜派”经典。五花肉冷水下锅加姜片、料酒煮八成熟，切片煸炒出油至卷曲，加豆瓣酱、甜面酱炒酱香，最后放青椒、蒜苗大火快炒。需选“二刀肉”（肥瘦3:7最佳），煮肉加少许盐让肉质紧实，考验火候把控，避免肉片发柴或油腻，短视频展示肉片煸炒过程与成品分量"
      },
      en: {
        name: "Twice-Cooked Pork",
        shortDescription: "A homely dish with salty and slightly spicy flavors, featuring fragrant and glutinous pork slices that are not greasy.",
        detailedDescription: "Named because the pork slices are first boiled and then stir-fried ('returned to the wok'), it is a classic of the 'salty and savory' school of Sichuan cuisine. Pork belly is boiled in cold water with ginger slices and cooking wine until 80% cooked, then sliced and stir-fried until curled and oily, followed by adding doubanjiang and sweet bean paste for a savory aroma, and finally green peppers and garlic sprouts are quickly stir-fried over high heat. It is essential to select 'second cut' pork (best with 30% fat and 70% lean), add a little salt during boiling to make the meat firm, and control the heat carefully to avoid the slices becoming tough or greasy. Short videos show the stir-frying process of the pork slices and the final portion."
      },
      de: {
        name: "Zweimal Gekochtes Schweinefleisch",
        shortDescription: "Ein hausgemachtes Gericht mit salzigen und leicht scharfen Aromen, mit duftenden und klebrigen Schweinefleischscheiben, die nicht fettig sind.",
        detailedDescription: "Benannt, weil die Schweinefleischscheiben zuerst gekocht und dann gebraten werden ('zurück in den Wok'), ist es ein Klassiker der 'salzig und herzhaft' Schule der Sichuan-Küche. Schweinebauch wird in kaltem Wasser mit Ingwerscheiben und Kochwein gekocht, bis er zu 80% gar ist, dann in Scheiben geschnitten und gebraten, bis er sich kräuselt und ölig ist, gefolgt von der Zugabe von Doubanjiang und süßer Bohnenpaste für ein herzhaftes Aroma, und schließlich werden grüne Pfeffer und Knoblauchsprossen bei hoher Hitze schnell gebraten. Es ist wichtig, 'zweiten Schnitt' Schweinefleisch (am besten mit 30% Fett und 70% mager) auszuwählen, beim Kochen etwas Salz hinzuzufügen, um das Fleisch fest zu machen, und die Hitze sorgfältig zu kontrollieren, um zu vermeiden, dass die Scheiben zäh oder fettig werden. Kurzvideos zeigen den Bratprozess der Schweinefleischscheiben und die endgültige Portion."
      }
    }
  },
  {
    id: "4",
    category: "sichuan",
    priceCents: 3800,
    tastes: [
      { zh: "鱼香", en: "Fish Fragrance", de: "Fischduft" },
      { zh: "酸甜", en: "Sweet and Sour", de: "Süß und Sauer" }
    ],
    ingredients: [
      { zh: "猪里脊", en: "Pork Tenderloin", de: "Schweinefilet" },
      { zh: "胡萝卜", en: "Carrot", de: "Karotte" },
      { zh: "木耳", en: "Wood Ear Mushroom", de: "Mu-Err-Pilz" },
      { zh: "泡椒", en: "Pickled Chili Pepper", de: "Eingelegte Chili" },
      { zh: "姜蒜", en: "Ginger and Garlic", de: "Ingwer und Knoblauch" },
      { zh: "白糖", en: "White Sugar", de: "Weißer Zucker" },
      { zh: "醋", en: "Vinegar", de: "Essig" }
    ],
    thumbnailUrl: "/images/yuxiang-rousi-thumb.jpg",
    imageUrl: "/images/yuxiang-rousi.jpg",
    translations: {
      zh: {
        name: "鱼香肉丝",
        shortDescription: "鱼香风味代表作，酸甜辣咸平衡得当",
        detailedDescription: "虽名“鱼香”却无鱼，风味源于川菜“鱼香汁”。猪里脊切丝用淀粉腌制增嫩滑，配菜兼顾营养与色彩。鱼香汁由泡椒、姜蒜、白糖、醋、生抽、淀粉调制，比例精准。起源于四川民间，最初是豆瓣酱、泡椒配鱼肉的香气，后推广到肉丝等食材。关键在鱼香汁调制，避免过甜或过酸，短视频展示食材切丝细节与成品分量"
      },
      en: {
        name: "Yu Xiang Rou Si",
        shortDescription: "A representative dish of fish fragrance flavor, with a balanced combination of sweet, sour, spicy, and salty.",
        detailedDescription: "Although named 'fish fragrance', it contains no fish; the flavor comes from the Sichuan 'fish fragrance sauce'. Pork tenderloin is shredded and marinated with starch for tenderness, and the side dishes consider both nutrition and color. The fish fragrance sauce is made from pickled chili peppers, ginger, garlic, white sugar, vinegar, light soy sauce, and starch, with precise proportions. It originated in Sichuan folk cuisine, initially using the aroma of doubanjiang and pickled chili peppers with fish, later extended to shredded pork and other ingredients. The key is the preparation of the fish fragrance sauce, avoiding excessive sweetness or sourness. Short videos show the details of shredding the ingredients and the final portion."
      },
      de: {
        name: "Yu Xiang Rou Si",
        shortDescription: "Ein repräsentatives Gericht mit Fischduft-Aroma, mit einer ausgewogenen Kombination von süß, sauer, scharf und salzig.",
        detailedDescription: "Obwohl 'Fischduft' im Namen, enthält es keinen Fisch; der Geschmack kommt von der Sichuan 'Fischduft-Sauce'. Schweinefilet wird in Streifen geschnitten und mit Stärke mariniert, um Zartheit zu erreichen, und die Beilagen berücksichtigen sowohl Ernährung als auch Farbe. Die Fischduft-Sauce wird aus eingelegten Chilischoten, Ingwer, Knoblauch, weißem Zucker, Essig, heller Sojasauce und Stärke hergestellt, mit präzisen Proportionen. Es entstand in der Sichuan-Volksküche, ursprünglich mit dem Aroma von Doubanjiang und eingelegten Chilischoten mit Fisch, später auf Schweinefleischstreifen und andere Zutaten erweitert. Der Schlüssel ist die Zubereitung der Fischduft-Sauce, um übermäßige Süße oder Säure zu vermeiden. Kurzvideos zeigen die Details des Schneidens der Zutaten in Streifen und die endgültige Portion."
      }
    }
  },
  {
    id: "5",
    category: "sichuan",
    priceCents: 4500,
    tastes: [
      { zh: "酸甜", en: "Sweet and Sour", de: "Süß und Sauer" },
      { zh: "微辣", en: "Slightly Spicy", de: "Leicht Scharf" }
    ],
    ingredients: [
      { zh: "鸡胸肉/鸡腿肉", en: "Chicken Breast / Chicken Thigh", de: "Hähnchenbrust / Hähnchenkeule" },
      { zh: "花生", en: "Peanuts", de: "Erdnüsse" },
      { zh: "干辣椒", en: "Dried Chili Pepper", de: "Getrocknete Chili" },
      { zh: "黄瓜", en: "Cucumber", de: "Gurke" },
      { zh: "胡萝卜", en: "Carrot", de: "Karotte" },
      { zh: "花椒", en: "Sichuan Peppercorn", de: "Szechuanpfeffer" }
    ],
    thumbnailUrl: "/images/kungpao-chicken-thumb.jpg",
    imageUrl: "/images/kungpao-chicken.jpg",
    translations: {
      zh: {
        name: "宫保鸡丁",
        shortDescription: "酸甜微辣的经典菜，鸡丁嫩滑、花生酥脆",
        detailedDescription: "原名“宫保鸡”，相传为清代四川总督丁宝桢所创，因官衔“太子少保”得名。选鸡腿肉切丁用盐、料酒、淀粉腌制，花生油炸至酥脆，与鸡丁、配菜翻炒后淋糖醋汁勾芡。需遵循“糊辣荔枝味”，“糊辣”来自干辣椒煸炒香，“荔枝味”指酸甜比例清新。部分版本加豆瓣酱，传统以糖醋汁为主，短视频展示鸡丁翻炒过程与成品分量"
      },
      en: {
        name: "Kung Pao Chicken",
        shortDescription: "A classic dish with sweet, sour, and slightly spicy flavors, featuring tender chicken cubes and crispy peanuts.",
        detailedDescription: "Originally named 'Gong Bao Chicken', it is said to have been created by Ding Baozhen, the Governor of Sichuan in the Qing Dynasty, and named after his official title 'Taizi Shaobao'. Chicken thigh meat is diced and marinated with salt, cooking wine, and starch, peanuts are deep-fried until crispy, then stir-fried with chicken cubes and side dishes, and finally coated with a sweet and sour sauce thickened with starch. It must follow the 'hu la li zhi wei' (blistered chili and lychee flavor), where 'hu la' comes from the fragrance of stir-fried dried chili peppers, and 'li zhi wei' refers to a fresh sweet and sour ratio. Some versions add doubanjiang, but the traditional one uses mainly sweet and sour sauce. Short videos show the stir-frying process of the chicken cubes and the final portion."
      },
      de: {
        name: "Kung Pao Chicken",
        shortDescription: "Ein klassisches Gericht mit süßen, sauren und leicht scharfen Aromen, mit zarten Hähnchenwürfeln und knusprigen Erdnüssen.",
        detailedDescription: "Ursprünglich 'Gong Bao Hähnchen' genannt, soll es von Ding Baozhen, dem Gouverneur von Sichuan in der Qing-Dynastie, erfunden worden sein und nach seinem offiziellen Titel 'Taizi Shaobao' benannt worden sein. Hähnchenkeulenfleisch wird gewürfelt und mit Salz, Kochwein und Stärke mariniert, Erdnüsse werden frittiert, bis sie knusprig sind, dann mit Hähnchenwürfeln und Beilagen gebraten und schließlich mit einer süß-sauren Sauce überzogen, die mit Stärke gebunden ist. Es muss dem 'Hu La Li Zhi Wei' (geblähte Chili und Litschigeschmack) folgen, wobei 'Hu La' vom Duft der gebratenen getrockneten Chilischoten kommt und 'Li Zhi Wei' sich auf ein frisches süß-saures Verhältnis bezieht. Einige Versionen fügen Doubanjiang hinzu, aber die traditionelle verwendet hauptsächlich süß-saure Sauce. Kurzvideos zeigen den Bratprozess der Hähnchenwürfel und die endgültige Portion."
      }
    }
  },
  {
    id: "6",
    category: "sichuan",
    priceCents: 7800,
    tastes: [
      { zh: "麻辣", en: "Numbing and Spicy", de: "Taub und Scharf" },
      { zh: "鲜香", en: "Umami and Aromatic", de: "Umami und Aromatisch" }
    ],
    ingredients: [
      { zh: "鸭血", en: "Duck Blood", de: "Entenblut" },
      { zh: "毛肚", en: "Tripe", de: "Kutteln" },
      { zh: "午餐肉", en: "Luncheon Meat", de: "Frühstücksfleisch" },
      { zh: "黄喉", en: "Aorta", de: "Aorta" },
      { zh: "豆芽", en: "Bean Sprouts", de: "Sojabohnensprossen" },
      { zh: "干辣椒", en: "Dried Chili Pepper", de: "Getrocknete Chili" },
      { zh: "花椒", en: "Sichuan Peppercorn", de: "Szechuanpfeffer" },
      { zh: "豆瓣酱", en: "Doubanjiang", de: "Doubanjiang" }
    ],
    thumbnailUrl: "/images/maoxue-wang-thumb.jpg",
    imageUrl: "/images/maoxue-wang.jpg",
    translations: {
      zh: {
        name: "毛血旺",
        shortDescription: "麻辣鲜香的江湖菜，食材丰富、分量十足",
        detailedDescription: "起源于重庆磁器口，属川菜江湖菜，“毛”指毛肚，“血”指鸭血，“旺”寓意兴旺。食材荤素搭配，鸭血嫩滑、毛肚脆爽、午餐肉香浓，底部铺豆芽吸汤汁。用豆瓣酱等炒红油锅底，加高汤煮沸后放食材煮熟。关键在食材新鲜，毛肚选水牛毛肚，鸭血无添加，适合多人分享，短视频展示食材下锅过程与成品分量"
      },
      en: {
        name: "Mao Xue Wang",
        shortDescription: "A spicy and aromatic Jianghu dish with rich ingredients and generous portion.",
        detailedDescription: "Originating from Ciqikou in Chongqing, it belongs to Sichuan Jianghu cuisine. 'Mao' refers to tripe, 'Xue' refers to duck blood, and 'Wang' symbolizes prosperity. The ingredients include both meat and vegetables: duck blood is tender and smooth, tripe is crispy, luncheon meat is flavorful, and bean sprouts are placed at the bottom to absorb the broth. The base is made by stir-frying doubanjiang etc. to create red oil, then adding stock and boiling before cooking the ingredients. The key is the freshness of ingredients: tripe should be from water buffalo, duck blood should be additive-free. It is suitable for sharing among multiple people. Short videos show the process of adding ingredients to the pot and the final portion."
      },
      de: {
        name: "Mao Xue Wang",
        shortDescription: "Ein scharfes und aromatisches Jianghu-Gericht mit reichhaltigen Zutaten und großzügiger Portion.",
        detailedDescription: "Ursprünglich aus Ciqikou in Chongqing, gehört es zur Sichuan Jianghu-Küche. 'Mao' bezieht sich auf Kutteln, 'Xue' auf Entenblut und 'Wang' symbolisiert Wohlstand. Die Zutaten umfassen sowohl Fleisch als auch Gemüse: Entenblut ist zart und glatt, Kutteln sind knusprig, Frühstücksfleisch ist geschmackvoll, und Sojabohnensprossen werden auf den Boden gelegt, um die Brühe aufzunehmen. Die Basis wird durch Braten von Doubanjiang usw. hergestellt, um rotes Öl zu erzeugen, dann wird Brühe hinzugefügt und gekocht, bevor die Zutaten gegart werden. Der Schlüssel ist die Frische der Zutaten: Kutteln sollten vom Wasserbüffel sein, Entenblut sollte ohne Zusatzstoffe sein. Es eignet sich zum Teilen unter mehreren Personen. Kurzvideos zeigen den Prozess des Hinzufügens der Zutaten zum Topf und die endgültige Portion."
      }
    }
  },
  {
    id: "7",
    category: "sichuan",
    priceCents: 6800,
    tastes: [
      { zh: "麻辣", en: "Numbing and Spicy", de: "Taub und Scharf" },
      { zh: "咸鲜", en: "Salty and Savory", de: "Salzig und Herzhaft" }
    ],
    ingredients: [
      { zh: "牛腱子肉", en: "Beef Shank", de: "Rinderhüfte" },
      { zh: "牛舌", en: "Beef Tongue", de: "Rinderzunge" },
      { zh: "牛百叶", en: "Beef Tripe", de: "Rinderkutteln" },
      { zh: "红油", en: "Red Oil", de: "Rotes Öl" },
      { zh: "花椒粉", en: "Sichuan Peppercorn Powder", de: "Szechuanpfeffer-Pulver" },
      { zh: "酱油", en: "Soy Sauce", de: "Sojasauce" },
      { zh: "白糖", en: "White Sugar", de: "Weißer Zucker" },
      { zh: "芝麻", en: "Sesame", de: "Sesam" }
    ],
    thumbnailUrl: "/images/fuqi-feipian-thumb.jpg",
    imageUrl: "/images/fuqi-feipian.jpg",
    translations: {
      zh: {
        name: "夫妻肺片",
        shortDescription: "红油凉拌经典，牛肉鲜嫩、酱香浓郁",
        detailedDescription: "由清代成都摆摊夫妻创制，最初用牛肺，后改牛腱子肉等。食材煮熟切片，淋特制红油酱汁，撒芝麻、香菜。红油用菜籽油等香料熬制，色泽红亮、香气醇厚，酱汁加少许白糖中和辣味。是川菜凉拌菜代表，适合开胃，短视频展示食材切片细节与成品摆盘分量"
      },
      en: {
        name: "Fu Qi Fei Pian",
        shortDescription: "A classic cold dish with red oil, featuring tender beef and rich sauce aroma.",
        detailedDescription: "Created by a street vendor couple in Chengdu during the Qing Dynasty, it originally used beef lung, but later changed to beef shank etc. The ingredients are boiled, sliced, and dressed with a special red oil sauce, then sprinkled with sesame and cilantro. The red oil is made by simmering rapeseed oil with spices, resulting in a bright red color and mellow aroma; the sauce adds a little white sugar to balance the spiciness. It is a representative Sichuan cold dish, suitable as an appetizer. Short videos show the details of slicing the ingredients and the final plating portion."
      },
      de: {
        name: "Fu Qi Fei Pian",
        shortDescription: "Ein klassisches kaltes Gericht mit rotem Öl, mit zartem Rindfleisch und reichhaltigem Sauce-Aroma.",
        detailedDescription: "Erfunden von einem Straßenverkäuferpaar in Chengdu während der Qing-Dynastie, verwendete es ursprünglich Rinderlunge, wurde aber später auf Rinderhüfte usw. geändert. Die Zutaten werden gekocht, in Scheiben geschnitten und mit einer speziellen roten Öl-Sauce beträufelt, dann mit Sesam und Koriander bestreut. Das rote Öl wird durch Köcheln von Rapsöl mit Gewürzen hergestellt, was zu einer hellroten Farbe und einem milden Aroma führt; die Sauce fügt etwas weißen Zucker hinzu, um die Schärfe auszugleichen. Es ist ein repräsentatives Sichuan-Kaltgericht, geeignet als Vorspeise. Kurzvideos zeigen die Details des Schneidens der Zutaten und die endgültige Portionierung beim Anrichten."
      }
    }
  },
  {
    id: "8",
    category: "sichuan",
    priceCents: 9800,
    tastes: [
      { zh: "咸鲜", en: "Salty and Savory", de: "Salzig und Herzhaft" },
      { zh: "微甜", en: "Slightly Sweet", de: "Leicht Süß" }
    ],
    ingredients: [
      { zh: "猪肘子", en: "Pork Knuckle", de: "Schweinehaxe" },
      { zh: "冰糖", en: "Rock Sugar", de: "Kandiszucker" },
      { zh: "酱油", en: "Soy Sauce", de: "Sojasauce" },
      { zh: "八角", en: "Star Anise", de: "Sternanis" },
      { zh: "桂皮", en: "Cinnamon", de: "Zimt" },
      { zh: "香叶", en: "Bay Leaf", de: "Lorbeerblatt" },
      { zh: "料酒", en: "Cooking Wine", de: "Kochwein" }
    ],
    thumbnailUrl: "/images/dongpo-zhouzi-thumb.jpg",
    imageUrl: "/images/dongpo-zhouzi.jpg",
    translations: {
      zh: {
        name: "东坡肘子",
        shortDescription: "软糯入味的硬菜，肥而不腻、入口即化",
        detailedDescription: "相传为北宋苏轼创制，属川菜“咸甜适口”代表。选完整猪前肘焯水去血沫，加冰糖、酱油、香料小火慢炖2-3小时至肉质软糯。关键在“慢炖”，火候不宜大，需多次翻面让酱汁均匀。食用可搭配椒盐或蒜泥解腻，适合宴席或家庭聚餐，短视频展示肘子炖制后软糯状态与整体分量"
      },
      en: {
        name: "Dong Po Zhou Zi",
        shortDescription: "A hearty dish with soft and glutinous texture, fatty but not greasy, melting in the mouth.",
        detailedDescription: "Legend has it that it was created by Su Shi in the Northern Song Dynasty, representing the 'salty and sweet' style of Sichuan cuisine. A whole pork front knuckle is blanched to remove blood foam, then simmered with rock sugar, soy sauce, and spices over low heat for 2-3 hours until the meat is soft and glutinous. The key is 'slow simmering'; the heat should not be too high, and it needs to be turned multiple times for even sauce coating. It can be served with pepper salt or garlic paste to reduce greasiness, suitable for banquets or family gatherings. Short videos show the soft state of the knuckle after simmering and the overall portion."
      },
      de: {
        name: "Dong Po Zhou Zi",
        shortDescription: "Ein herzhaftes Gericht mit weicher und klebriger Textur, fettig aber nicht fett, zergeht auf der Zunge.",
        detailedDescription: "Der Legende nach wurde es von Su Shi in der Nördlichen Song-Dynastie erfunden und repräsentiert den 'salzig und süß' Stil der Sichuan-Küche. Eine ganze Schweinevorderhaxe wird blanchiert, um Blutschaum zu entfernen, dann mit Kandiszucker, Sojasauce und Gewürzen bei schwacher Hitze 2-3 Stunden gekocht, bis das Fleisch weich und klebrig ist. Der Schlüssel ist 'langsames Köcheln'; die Hitze sollte nicht zu hoch sein, und es muss mehrmals gewendet werden, um eine gleichmäßige Sauce-Beschichtung zu gewährleisten. Es kann mit Pfeffersalz oder Knoblauchpaste serviert werden, um Fettigkeit zu reduzieren, geeignet für Bankette oder Familienfeiern. Kurzvideos zeigen den weichen Zustand der Haxe nach dem Köcheln und die gesamte Portion."
      }
    }
  },
  {
    id: "9",
    category: "sichuan",
    priceCents: 7200,
    tastes: [
      { zh: "麻辣", en: "Numbing and Spicy", de: "Taub und Scharf" },
      { zh: "酥脆", en: "Crispy", de: "Knusprig" }
    ],
    ingredients: [
      { zh: "鸡腿肉", en: "Chicken Thigh", de: "Hähnchenkeule" },
      { zh: "干辣椒", en: "Dried Chili Pepper", de: "Getrocknete Chili" },
      { zh: "花椒", en: "Sichuan Peppercorn", de: "Szechuanpfeffer" },
      { zh: "姜蒜", en: "Ginger and Garlic", de: "Ingwer und Knoblauch" },
      { zh: "料酒", en: "Cooking Wine", de: "Kochwein" },
      { zh: "淀粉", en: "Starch", de: "Stärke" },
      { zh: "芝麻", en: "Sesame", de: "Sesam" }
    ],
    thumbnailUrl: "/images/lazi-ji-thumb.jpg",
    imageUrl: "/images/lazi-ji.jpg",
    translations: {
      zh: {
        name: "辣子鸡",
        shortDescription: "外酥里嫩的江湖菜，麻辣鲜香、越吃越上头",
        detailedDescription: "起源于重庆歌乐山，属川菜江湖菜经典。鸡腿肉切块用盐、料酒、淀粉腌制，油炸至外酥里嫩，与大量干辣椒、花椒煸炒后撒芝麻。“灵魂”在干辣椒用量，选贵州新一代辣椒，油炸油温需控制避免焦或吸油。适合下酒，鸡肉吃完后辣椒可打包拌面，短视频展示鸡肉油炸过程与成品分量"
      },
      en: {
        name: "La Zi Ji",
        shortDescription: "A Jianghu dish with crispy exterior and tender interior, numbing, spicy, and aromatic, becoming more addictive as you eat.",
        detailedDescription: "Originating from Gele Mountain in Chongqing, it is a classic of Sichuan Jianghu cuisine. Chicken thigh is cut into pieces and marinated with salt, cooking wine, and starch, then deep-fried until crispy outside and tender inside, and stir-fried with a large amount of dried chili peppers and Sichuan peppercorns, then sprinkled with sesame. The 'soul' lies in the quantity of dried chili peppers, selected from Guizhou new generation peppers; the frying temperature must be controlled to avoid burning or oil absorption. It is suitable as a snack with alcohol, and the leftover chili peppers can be packed for tossing with noodles. Short videos show the frying process of the chicken and the final portion."
      },
      de: {
        name: "La Zi Ji",
        shortDescription: "Ein Jianghu-Gericht mit knuspriger Außenseite und zarter Innenseite, taub, scharf und aromatisch, wird süchtig machender, je mehr man isst.",
        detailedDescription: "Ursprünglich vom Gele Berg in Chongqing, ist es ein Klassiker der Sichuan Jianghu-Küche. Hähnchenkeule wird in Stücke geschnitten und mit Salz, Kochwein und Stärke mariniert, dann frittiert, bis außen knusprig und innen zart, und mit einer großen Menge getrockneter Chilischoten und Szechuanpfeffer gebraten, dann mit Sesam bestreut. Die 'Seele' liegt in der Menge der getrockneten Chilischoten, ausgewählt aus Guizhou Neue Generation Chilischoten; die Frittieremperatur muss kontrolliert werden, um Verbrennung oder Ölabsorption zu vermeiden. Es eignet sich als Snack zu Alkohol, und die übrig gebliebenen Chilischoten können zum Vermischen mit Nudeln eingepackt werden. Kurzvideos zeigen den Frittierprozess des Hähnchens und die endgültige Portion."
      }
    }
  },
  {
    id: "10",
    category: "sichuan",
    priceCents: 3200,
    tastes: [
      { zh: "干香", en: "Dry and Aromatic", de: "Trocken und Aromatisch" },
      { zh: "微辣", en: "Slightly Spicy", de: "Leicht Scharf" }
    ],
    ingredients: [
      { zh: "四季豆", en: "Green Beans", de: "Grüne Bohnen" },
      { zh: "猪肉末", en: "Ground Pork", de: "Schweinehackfleisch" },
      { zh: "干辣椒", en: "Dried Chili Pepper", de: "Getrocknete Chili" },
      { zh: "花椒", en: "Sichuan Peppercorn", de: "Szechuanpfeffer" },
      { zh: "姜蒜", en: "Ginger and Garlic", de: "Ingwer und Knoblauch" },
      { zh: "盐", en: "Salt", de: "Salz" },
      { zh: "酱油", en: "Soy Sauce", de: "Sojasauce" }
    ],
    thumbnailUrl: "/images/ganbian-sijidou-thumb.jpg",
    imageUrl: "/images/ganbian-sijidou.jpg",
    translations: {
      zh: {
        name: "干煸四季豆",
        shortDescription: "干香下饭的家常菜，四季豆脆嫩、咸香微辣",
        detailedDescription: "是川菜“干煸”技法代表，选鲜嫩长豆角切段，热油炸至表面微皱、水分收干，与肉末等煸炒调味。关键在“炸至断生”，去生腥味且保脆嫩，避免软烂。需注意未煮熟四季豆含毒素，务必熟透，是经典下饭菜，短视频展示四季豆油炸后状态与成品分量"
      },
      en: {
        name: "Gan Bian Si Ji Dou",
        shortDescription: "A homely dish with dry aroma that goes well with rice, featuring crispy and tender green beans with salty and slightly spicy flavors.",
        detailedDescription: "It is a representative of the 'dry frying' technique in Sichuan cuisine. Fresh and tender long beans are cut into sections, deep-fried in hot oil until the surface is slightly wrinkled and moisture is reduced, then stir-fried with ground pork etc. for seasoning. The key is 'frying until cooked through', removing the raw odor while maintaining crisp tenderness, avoiding mushiness. Note that undercooked green beans contain toxins, so they must be thoroughly cooked. It is a classic dish that pairs well with rice. Short videos show the state of the green beans after frying and the final portion."
      },
      de: {
        name: "Gan Bian Si Ji Dou",
        shortDescription: "Ein hausgemachtes Gericht mit trockenem Aroma, das gut zu Reis passt, mit knusprigen und zarten grünen Bohnen mit salzigen und leicht scharfen Aromen.",
        detailedDescription: "Es ist ein Vertreter der 'Trockenbrat'-Technik in der Sichuan-Küche. Frische und zarte lange Bohnen werden in Abschnitte geschnitten, in heißem Öl frittiert, bis die Oberfläche leicht runzlig und die Feuchtigkeit reduziert ist, dann mit Schweinehackfleisch usw. gebraten und gewürzt. Der Schlüssel ist 'Braten bis durchgegart', um den rohen Geruch zu entfernen und gleichzeitig knusprige Zartheit zu bewahren, um Matschigkeit zu vermeiden. Beachten Sie, dass ungekochte grüne Bohnen Toxine enthalten, daher müssen sie gründlich gekocht werden. Es ist ein klassisches Gericht, das gut zu Reis passt. Kurzvideos zeigen den Zustand der grünen Bohnen nach dem Frittieren und die endgültige Portion."
      }
    }
  },
  {
    id: "11",
    category: "xian",
    priceCents: 1500,
    tastes: [
      { zh: "咸香", en: "Salty and Aromatic", de: "Salzig und Aromatisch" },
      { zh: "软糯", en: "Soft and Glutinous", de: "Weich und Klebrig" }
    ],
    ingredients: [
      { zh: "面粉", en: "Flour", de: "Mehl" },
      { zh: "猪五花肉", en: "Pork Belly", de: "Schweinebauch" },
      { zh: "八角", en: "Star Anise", de: "Sternanis" },
      { zh: "桂皮", en: "Cinnamon", de: "Zimt" },
      { zh: "香叶", en: "Bay Leaf", de: "Lorbeerblatt" },
      { zh: "花椒", en: "Sichuan Peppercorn", de: "Szechuanpfeffer" },
      { zh: "料酒", en: "Cooking Wine", de: "Kochwein" },
      { zh: "酱油", en: "Soy Sauce", de: "Sojasauce" }
    ],
    thumbnailUrl: "/images/roujiamo-thumb.jpg",
    imageUrl: "/images/roujiamo.jpg",
    translations: {
      zh: {
        name: "肉夹馍",
        shortDescription: "西安特色主食，外酥里嫩、肉香浓郁",
        detailedDescription: "属西安经典腊汁肉夹馍，馍用中筋面粉发酵烙制，外皮酥脆、内部松软；腊汁肉选猪五花肉，加多种香料小火慢炖4-6小时至入味。“腊汁”需长期保存越陈越香，每次炖肉加新调料。食用时馍切开放剁碎的腊汁肉，可加青椒或香菜，短视频展示馍烙制过程与夹肉后饱满状态"
      },
      en: {
        name: "Rou Jia Mo",
        shortDescription: "A Xi'an specialty staple, with crispy exterior and tender interior, rich meat aroma.",
        detailedDescription: "It belongs to the classic Xi'an cured meat sandwich. The mo (bread) is made from medium-gluten flour, fermented and baked, resulting in a crispy crust and soft interior; the cured meat uses pork belly, simmered with various spices over low heat for 4-6 hours until flavorful. The 'cured juice' needs long-term storage and becomes more aromatic with age; new seasonings are added each time when simmering the meat. When eating, the mo is cut open and filled with chopped cured meat, and green pepper or cilantro can be added. Short videos show the process of baking the mo and the full state after filling with meat."
      },
      de: {
        name: "Rou Jia Mo",
        shortDescription: "Eine Xi'an-Spezialität als Hauptnahrungsmittel, mit knuspriger Außenseite und zarter Innenseite, reichhaltigem Fleischaroma.",
        detailedDescription: "Es gehört zum klassischen Xi'an gepökelten Fleischsandwich. Das Mo (Brot) wird aus Mittelglutenmehl hergestellt, fermentiert und gebacken, was zu einer knusprigen Kruste und weichem Inneren führt; das gepökelte Fleisch verwendet Schweinebauch, der mit verschiedenen Gewürzen bei schwacher Hitze 4-6 Stunden gekocht wird, bis er geschmackvoll ist. Der 'gepökelte Saft' muss langfristig gelagert werden und wird mit der Zeit aromatischer; jedes Mal beim Kochen des Fleisches werden neue Gewürze hinzugefügt. Beim Essen wird das Mo aufgeschnitten und mit gehacktem gepökelten Fleisch gefüllt, und grüner Pfeffer oder Koriander kann hinzugefügt werden. Kurzvideos zeigen den Prozess des Backens des Mo und den vollen Zustand nach dem Füllen mit Fleisch."
      }
    }
  },
  {
    id: "12",
    category: "xian",
    priceCents: 4500,
    tastes: [
      { zh: "咸鲜", en: "Salty and Savory", de: "Salzig und Herzhaft" },
      { zh: "醇厚", en: "Mellow", de: "Mild" }
    ],
    ingredients: [
      { zh: "羊肉", en: "Lamb", de: "Lamm" },
      { zh: "面粉", en: "Flour", de: "Mehl" },
      { zh: "粉丝", en: "Vermicelli", de: "Glasnudeln" },
      { zh: "葱花", en: "Chopped Green Onion", de: "Gehackte Frühlingszwiebel" },
      { zh: "香菜", en: "Cilantro", de: "Koriander" },
      { zh: "糖蒜", en: "Sweet Garlic", de: "Süßer Knoblauch" },
      { zh: "花椒", en: "Sichuan Peppercorn", de: "Szechuanpfeffer" },
      { zh: "姜片", en: "Ginger Slices", de: "Ingwerscheiben" }
    ],
    thumbnailUrl: "/images/yangrou-paomo-thumb.jpg",
    imageUrl: "/images/yangrou-paomo.jpg",
    translations: {
      zh: {
        name: "羊肉泡馍",
        shortDescription: "西安经典汤品，汤鲜馍烂、羊肉醇香",
        detailedDescription: "是西安“三秦套餐”之一，被誉为“西北第一汤”。馍需亲手掰碎越碎越入味，羊肉汤用羊骨、羊肉慢炖6小时以上汤色奶白。煮馍时放掰好的馍、粉丝、羊肉片小火煮至馍吸满汤汁。汤是“灵魂”，炖制需去腥撇浮沫，食用搭配糖蒜解腻、辣椒酱增香，短视频展示掰馍过程与成品大碗分量"
      },
      en: {
        name: "Yang Rou Pao Mo",
        shortDescription: "A classic Xi'an soup dish, with fresh soup, soft bread, and mellow lamb aroma.",
        detailedDescription: "It is one of the 'San Qin set meals' in Xi'an, known as the 'Number One Soup in Northwest China'. The mo needs to be broken into pieces by hand—the smaller, the more flavorful. The lamb soup is made by slow-simmering lamb bones and meat for over 6 hours until the soup is milky white. When cooking, the broken mo, vermicelli, and lamb slices are added and simmered over low heat until the mo absorbs the soup. The soup is the 'soul'; during simmering, it is essential to remove the gaminess and skim off the foam. It is served with sweet garlic to reduce greasiness and chili sauce to enhance fragrance. Short videos show the process of breaking the mo and the large bowl portion of the final product."
      },
      de: {
        name: "Yang Rou Pao Mo",
        shortDescription: "Eine klassische Xi'an-Suppe, mit frischer Suppe, weichem Brot und mildem Lammaroma.",
        detailedDescription: "Es ist eine der 'San Qin Menüs' in Xi'an, bekannt als die 'Nummer Eins Suppe in Nordwestchina'. Das Mo muss von Hand in Stücke gebrochen werden—je kleiner, desto geschmackvoller. Die Lammsuppe wird durch langsames Köcheln von Lammknochen und -fleisch über 6 Stunden hergestellt, bis die Suppe milchig weiß ist. Beim Kochen werden die gebrochenen Mo, Glasnudeln und Lamm scheiben hinzugefügt und bei schwacher Hitze gekocht, bis das Mo die Suppe absorbiert. Die Suppe ist die 'Seele'; während des Köchelns ist es wichtig, den Wildgeschmack zu entfernen und den Schaum abzuschöpfen. Es wird mit süßem Knoblauch serviert, um Fettigkeit zu reduzieren, und Chilisauce, um den Duft zu verstärken. Kurzvideos zeigen den Prozess des Brechens des Mo und die große Schüssel Portion des Endprodukts."
      }
    }
  },
  {
    id: "13",
    category: "xian",
    priceCents: 2800,
    tastes: [
      { zh: "咸鲜", en: "Salty and Savory", de: "Salzig und Herzhaft" },
      { zh: "微辣", en: "Slightly Spicy", de: "Leicht Scharf" }
    ],
    ingredients: [
      { zh: "高筋面粉", en: "High-Gluten Flour", de: "Hochglutenmehl" },
      { zh: "猪肉末", en: "Ground Pork", de: "Schweinehackfleisch" },
      { zh: "青菜", en: "Green Vegetables", de: "Grüngemüse" },
      { zh: "红油", en: "Red Oil", de: "Rotes Öl" },
      { zh: "酱油", en: "Soy Sauce", de: "Sojasauce" },
      { zh: "醋", en: "Vinegar", de: "Essig" },
      { zh: "蒜末", en: "Minced Garlic", de: "Gehackter Knoblauch" },
      { zh: "辣椒面", en: "Chili Powder", de: "Chilipulver" }
    ],
    thumbnailUrl: "/images/biangbiang-mian-thumb.jpg",
    imageUrl: "/images/biangbiang-mian.jpg",
    translations: {
      zh: {
        name: "BiangBiang面",
        shortDescription: "陕西宽面代表，筋道爽滑、酱香浓郁",
        detailedDescription: "因制作时面条撞案板发“biangbiang”声得名，属陕西关中特色面食。面条用高筋面粉和面醒发，手工拉成宽3厘米面条，煮熟后淋肉末酱汁，撒蒜末、辣椒面浇热油激香。biang字是笔画最多汉字之一，有专属口诀，面条筋道度取决于和面水量与醒发时间，分量足饱腹感强，短视频展示手工拉面过程与成品分量"
      },
      en: {
        name: "BiangBiang Noodles",
        shortDescription: "Representative of Shaanxi wide noodles, chewy and smooth with rich sauce aroma.",
        detailedDescription: "Named after the 'biangbiang' sound made when the noodles hit the board during preparation, it is a characteristic noodle dish from Guanzhong, Shaanxi. The noodles are made from high-gluten flour, kneaded and proofed, then hand-pulled into 3cm wide strips, boiled and topped with ground pork sauce, then sprinkled with minced garlic and chili powder, and drizzled with hot oil to activate the fragrance. The character 'biang' is one of the Chinese characters with the most strokes and has a unique mnemonic. The chewiness of the noodles depends on the water content and proofing time. The portion is substantial and filling. Short videos show the hand-pulling process and the final portion."
      },
      de: {
        name: "BiangBiang Nudeln",
        shortDescription: "Repräsentativ für Shaanxi breite Nudeln, zäh und glatt mit reichhaltigem Sauce-Aroma.",
        detailedDescription: "Benannt nach dem 'biangbiang' Geräusch, das entsteht, wenn die Nudeln während der Zubereitung auf das Brett treffen, ist es ein charakteristisches Nudelgericht aus Guanzhong, Shaanxi. Die Nudeln werden aus Hochglutenmehl hergestellt, geknetet und gehen gelassen, dann von Hand zu 3 cm breiten Streifen gezogen, gekocht und mit Schweinehackfleischsauce beträufelt, dann mit gehacktem Knoblauch und Chilipulver bestreut und mit heißem Öl übergossen, um den Duft zu aktivieren. Das Zeichen 'biang' ist eines der chinesischen Zeichen mit den meisten Strichen und hat eine einzigartige Eselsbrücke. Die Zähheit der Nudeln hängt vom Wassergehalt und der Gehzeit ab. Die Portion ist substantial und sättigend. Kurzvideos zeigen den Handziehprozess und die endgültige Portion."
      }
    }
  },
  {
    id: "14",
    category: "xian",
    priceCents: 1800,
    tastes: [
      { zh: "甜而不腻", en: "Sweet but Not Greasy", de: "Süß aber nicht fettig" },
      { zh: "软糯", en: "Soft and Glutinous", de: "Weich und Klebrig" }
    ],
    ingredients: [
      { zh: "糯米", en: "Glutinous Rice", de: "Klebreis" },
      { zh: "红枣", en: "Red Dates", de: "Rote Datteln" },
      { zh: "葡萄干", en: "Raisins", de: "Rosinen" },
      { zh: "豆沙", en: "Red Bean Paste", de: "Rote Bohnenpaste" }
    ],
    thumbnailUrl: "/images/zeng-gao-thumb.jpg",
    imageUrl: "/images/zeng-gao.jpg",
    translations: {
      zh: {
        name: "甑糕",
        shortDescription: "西安传统甜食，糯米软糯、红枣香甜",
        detailedDescription: "因用“甑”蒸制得名，历史悠久。糯米提前浸泡4小时，与红枣、葡萄干交替铺甑中，大火蒸2-3小时至糯米软糯、红枣融化。关键在“分层蒸制”，每层食材薄确保受热均匀，蒸制需多次洒水防糯米干燥，可直接吃或搭坚果碎，短视频展示蒸制后分层状态与成品分量"
      },
      en: {
        name: "Zeng Gao",
        shortDescription: "A traditional Xi'an sweet food, with soft glutinous rice and sweet red dates.",
        detailedDescription: "Named after being steamed in a 'zeng' (a type of steamer), it has a long history. Glutinous rice is soaked for 4 hours in advance, then layered alternately with red dates and raisins in the zeng, and steamed over high heat for 2-3 hours until the rice is soft and the dates melt. The key is 'layered steaming'; each layer of ingredients should be thin to ensure even heating, and water needs to be sprinkled multiple times during steaming to prevent the rice from drying out. It can be eaten directly or with crushed nuts. Short videos show the layered state after steaming and the final portion."
      },
      de: {
        name: "Zeng Gao",
        shortDescription: "Ein traditionelles Xi'an süßes Essen, mit weichem Klebreis und süßen roten Datteln.",
        detailedDescription: "Benannt nach dem Dämpfen in einem 'Zeng' (eine Art Dampfgarer), hat es eine lange Geschichte. Klebreis wird 4 Stunden im Voraus eingeweicht, dann abwechselnd mit roten Datteln und Rosinen im Zeng geschichtet und bei hoher Hitze 2-3 Stunden gedämpft, bis der Reis weich ist und die Datteln schmelzen. Der Schlüssel ist 'geschichtetes Dämpfen'; jede Zutatenschicht sollte dünn sein, um gleichmäßige Erwärmung zu gewährleisten, und während des Dämpfens muss mehrmals Wasser gesprüht werden, um ein Austrocknen des Reises zu verhindern. Es kann direkt gegessen oder mit gemahlenen Nüssen serviert werden. Kurzvideos zeigen den geschichteten Zustand nach dem Dämpfen und die endgültige Portion."
      }
    }
  },
  {
    id: "15",
    category: "xian",
    priceCents: 8800,
    tastes: [
      { zh: "咸香", en: "Salty and Aromatic", de: "Salzig und Aromatisch" },
      { zh: "皮脆", en: "Crispy Skin", de: "Knusprige Haut" }
    ],
    ingredients: [
      { zh: "三黄鸡", en: "San Huang Chicken", de: "San Huang Huhn" },
      { zh: "姜片", en: "Ginger Slices", de: "Ingwerscheiben" },
      { zh: "葱段", en: "Scallion Sections", de: "Frühlingszwiebelstücke" },
      { zh: "八角", en: "Star Anise", de: "Sternanis" },
      { zh: "桂皮", en: "Cinnamon", de: "Zimt" },
      { zh: "料酒", en: "Cooking Wine", de: "Kochwein" },
      { zh: "淀粉", en: "Starch", de: "Stärke" },
      { zh: "椒盐", en: "Pepper Salt", de: "Pfeffersalz" }
    ],
    thumbnailUrl: "/images/hulu-ji-thumb.jpg",
    imageUrl: "/images/hulu-ji.jpg",
    translations: {
      zh: {
        name: "葫芦鸡",
        shortDescription: "西安经典硬菜，外酥里嫩、造型独特",
        detailedDescription: "属陕菜经典宴席菜，因造型似葫芦得名。选1.5kg左右三黄鸡，处理后用香料腌制2小时，料酒去腥，裹淀粉糊油炸至金黄。关键在“三次油炸”，低温定型、中温熟透、高温酥脆，鸡肉需提前去骨做葫芦造型。食用蘸椒盐，外脆里嫩，短视频展示鸡身造型与切开后鲜嫩肉质"
      },
      en: {
        name: "Hu Lu Ji",
        shortDescription: "A classic Xi'an hearty dish, with crispy exterior and tender interior, unique shape.",
        detailedDescription: "It belongs to the classic banquet dishes of Shaanxi cuisine, named for its gourd-like shape. A San Huang chicken of about 1.5kg is selected, processed, marinated with spices for 2 hours, cooking wine to remove gaminess, coated with starch batter and deep-fried until golden. The key is 'three-time frying': low temperature for setting, medium temperature for cooking through, high temperature for crispiness. The chicken needs to be deboned in advance to form the gourd shape. It is served with pepper salt for dipping, crispy outside and tender inside. Short videos show the chicken's shape and the fresh tender meat after cutting."
      },
      de: {
        name: "Hu Lu Ji",
        shortDescription: "Ein klassisches Xi'an herzhaftes Gericht, mit knuspriger Außenseite und zarter Innenseite, einzigartige Form.",
        detailedDescription: "Es gehört zu den klassischen Bankettgerichten der Shaanxi-Küche, benannt nach seiner kürbisähnlichen Form. Ein San Huang Huhn von etwa 1,5 kg wird ausgewählt, verarbeitet, mit Gewürzen 2 Stunden mariniert, Kochwein zur Entfernung von Wildgeschmack, mit Stärketeig überzogen und goldbraun frittiert. Der Schlüssel ist 'dreimaliges Frittieren': niedrige Temperatur zum Formen, mittlere Temperatur zum Durchgaren, hohe Temperatur für Knusprigkeit. Das Huhn muss im Voraus entbeint werden, um die Kürbisform zu bilden. Es wird mit Pfeffersalz zum Dippen serviert, außen knusprig und innen zart. Kurzvideos zeigen die Form des Huhns und das frische zarte Fleisch nach dem Schneiden."
      }
    }
  },
  {
    id: "16",
    category: "xian",
    priceCents: 2200,
    tastes: [
      { zh: "咸鲜", en: "Salty and Savory", de: "Salzig und Herzhaft" },
      { zh: "微辣", en: "Slightly Spicy", de: "Leicht Scharf" }
    ],
    ingredients: [
      { zh: "高筋面粉", en: "High-Gluten Flour", de: "Hochglutenmehl" },
      { zh: "青菜", en: "Green Vegetables", de: "Grüngemüse" },
      { zh: "辣椒面", en: "Chili Powder", de: "Chilipulver" },
      { zh: "蒜末", en: "Minced Garlic", de: "Gehackter Knoblauch" },
      { zh: "酱油", en: "Soy Sauce", de: "Sojasauce" },
      { zh: "醋", en: "Vinegar", de: "Essig" },
      { zh: "芝麻", en: "Sesame", de: "Sesam" },
      { zh: "食用油", en: "Cooking Oil", de: "Speiseöl" }
    ],
    thumbnailUrl: "/images/youpo-mian-thumb.jpg",
    imageUrl: "/images/youpo-mian.jpg",
    translations: {
      zh: {
        name: "油泼面",
        shortDescription: "西安街头经典面食，热油激香、辣香过瘾",
        detailedDescription: "是西安街头代表性面食，做法简单风味足。面条用高筋面粉手工擀制切长条，煮熟后铺青菜，撒辣椒面、蒜末、芝麻，淋酱油、醋，浇八成热食用油激香。泼油温度关键（180℃左右），过低不香、过高易糊，可选宽面或细面，短视频展示泼油瞬间与成品分量"
      },
      en: {
        name: "You Po Mian",
        shortDescription: "A classic Xi'an street noodle dish, activated by hot oil for a spicy and aromatic experience.",
        detailedDescription: "It is a representative street noodle dish in Xi'an, simple to make but full of flavor. The noodles are made from high-gluten flour, hand-rolled and cut into long strips, boiled and topped with green vegetables, then sprinkled with chili powder, minced garlic, and sesame, drizzled with soy sauce and vinegar, and finally poured with 80% hot cooking oil to activate the fragrance. The oil temperature is critical (around 180°C); too low and it won't be fragrant, too high and it may burn. You can choose wide or thin noodles. Short videos show the moment of pouring the oil and the final portion."
      },
      de: {
        name: "You Po Mian",
        shortDescription: "Ein klassisches Xi'an Straßennudelgericht, aktiviert durch heißes Öl für ein scharfes und aromatisches Erlebnis.",
        detailedDescription: "Es ist ein repräsentatives Straßennudelgericht in Xi'an, einfach zuzubereiten aber voller Geschmack. Die Nudeln werden aus Hochglutenmehl hergestellt, von Hand gerollt und in lange Streifen geschnitten, gekocht und mit Grüngemüse belegt, dann mit Chilipulver, gehacktem Knoblauch und Sesam bestreut, mit Sojasauce und Essig beträufelt und schließlich mit 80% heißem Speiseöl übergossen, um den Duft zu aktivieren. Die Öltemperatur ist kritisch (um 180°C); zu niedrig und es wird nicht duftend, zu hoch und es kann verbrennen. Sie können breite oder dünne Nudeln wählen. Kurzvideos zeigen den Moment des Ölgießens und die endgültige Portion."
      }
    }
  },
  {
    id: "17",
    category: "xian",
    priceCents: 1800,
    tastes: [
      { zh: "酸辣", en: "Sour and Spicy", de: "Sauer und Scharf" },
      { zh: "清爽", en: "Refreshing", de: "Erfrischend" }
    ],
    ingredients: [
      { zh: "小麦粉/大米粉", en: "Wheat Flour / Rice Flour", de: "Weizenmehl / Reismehl" },
      { zh: "黄瓜", en: "Cucumber", de: "Gurke" },
      { zh: "豆芽", en: "Bean Sprouts", de: "Sojabohnensprossen" },
      { zh: "面筋", en: "Gluten", de: "Gluten" },
      { zh: "红油", en: "Red Oil", de: "Rotes Öl" },
      { zh: "醋", en: "Vinegar", de: "Essig" },
      { zh: "酱油", en: "Soy Sauce", de: "Sojasauce" },
      { zh: "蒜水", en: "Garlic Water", de: "Knoblauchwasser" },
      { zh: "芝麻酱", en: "Sesame Paste", de: "Sesampaste" }
    ],
    thumbnailUrl: "/images/liangpi-thumb.jpg",
    imageUrl: "/images/liangpi.jpg",
    translations: {
      zh: {
        name: "凉皮",
        shortDescription: "西安消暑小吃，口感爽滑、酸辣开胃",
        detailedDescription: "此处为经典小麦面皮，由面粉洗面后蒸制，口感爽滑筋道，搭黄瓜丝、豆芽、面筋，淋红油等调料拌匀。“灵魂”在醋与红油比例，醋选陕西香醋，红油熬制红亮不呛口。可按喜好选“多醋”“少辣”，短视频展示凉皮爽滑质感与配菜丰富度"
      },
      en: {
        name: "Liang Pi",
        shortDescription: "A Xi'an summer snack, smooth texture, sour and spicy to appetize.",
        detailedDescription: "Here it is the classic wheat liangpi, made by washing flour and then steaming, resulting in a smooth and chewy texture, served with shredded cucumber, bean sprouts, and gluten, and mixed with red oil etc. The 'soul' lies in the ratio of vinegar and red oil; vinegar is selected from Shaanxi aromatic vinegar, and red oil is simmered to be bright red and not pungent. You can choose 'more vinegar' or 'less spicy' according to preference. Short videos show the smooth texture of liangpi and the richness of side dishes."
      },
      de: {
        name: "Liang Pi",
        shortDescription: "Ein Xi'an Sommersnack, glatte Textur, sauer und scharf zum Appetitanregen.",
        detailedDescription: "Hier ist es der klassische Weizen-Liangpi, hergestellt durch Waschen von Mehl und dann Dämpfen, was zu einer glatten und zähen Textur führt, serviert mit Gurkenstreifen, Sojabohnensprossen und Gluten, und gemischt mit rotem Öl usw. Die 'Seele' liegt im Verhältnis von Essig und rotem Öl; Essig wird aus Shaanxi aromatischem Essig ausgewählt, und rotes Öl wird gekocht, um hellrot und nicht stechend zu sein. Sie können 'mehr Essig' oder 'weniger scharf' nach Vorliebe wählen. Kurzvideos zeigen die glatte Textur von Liangpi und die Reichhaltigkeit der Beilagen."
      }
    }
  },
  {
    id: "18",
    category: "xian",
    priceCents: 2800,
    tastes: [
      { zh: "咸鲜", en: "Salty and Savory", de: "Salzig und Herzhaft" },
      { zh: "鲜香", en: "Umami and Aromatic", de: "Umami und Aromatisch" }
    ],
    ingredients: [
      { zh: "中筋面粉", en: "Medium-Gluten Flour", de: "Mittelglutenmehl" },
      { zh: "猪前腿肉", en: "Pork Foreleg Meat", de: "Schweinevorderlauf" },
      { zh: "皮冻", en: "Skin Jelly", de: "Hautgelee" },
      { zh: "姜葱", en: "Ginger and Scallion", de: "Ingwer und Frühlingszwiebel" },
      { zh: "料酒", en: "Cooking Wine", de: "Kochwein" },
      { zh: "酱油", en: "Soy Sauce", de: "Sojasauce" },
      { zh: "盐", en: "Salt", de: "Salz" }
    ],
    thumbnailUrl: "/images/guantang-bao-thumb.jpg",
    imageUrl: "/images/guantang-bao.jpg",
    translations: {
      zh: {
        name: "灌汤包",
        shortDescription: "西安特色蒸点，皮薄馅大、汤汁浓郁",
        detailedDescription: "融合陕菜厚重与面点精致，皮薄如纸、馅大饱满。面皮用中筋面粉温水和面醒发，确保皮薄有韧性；馅料选猪前腿肉加切碎皮冻，蒸制时皮冻融化成汤汁。蒸制时间8-10分钟，避免皮破汤漏或馅未熟。食用先咬小口吸汤防烫，搭醋与姜丝解腻，短视频展示包子皮薄透亮与咬开后汤汁流出瞬间"
      },
      en: {
        name: "Guan Tang Bao",
        shortDescription: "A Xi'an specialty steamed bun, thin skin, large filling, rich soup.",
        detailedDescription: "Combining the heartiness of Shaanxi cuisine with the delicacy of dim sum, the skin is as thin as paper and the filling is large and plump. The dough is made from medium-gluten flour with warm water, kneaded and proofed to ensure thin and resilient skin; the filling uses pork foreleg meat with chopped skin jelly, which melts into soup during steaming. Steaming time is 8-10 minutes to avoid broken skin, leaked soup, or undercooked filling. When eating, bite a small hole first to suck the soup to prevent burning, and serve with vinegar and ginger shreds to reduce greasiness. Short videos show the thin and translucent skin of the bun and the moment soup flows out when bitten."
      },
      de: {
        name: "Guan Tang Bao",
        shortDescription: "Eine Xi'an-Spezialität gedämpfte Brötchen, dünne Haut, große Füllung, reichhaltige Suppe.",
        detailedDescription: "Kombiniert die Herzhaftigkeit der Shaanxi-Küche mit der Feinheit von Dim Sum, die Haut ist dünn wie Papier und die Füllung ist groß und prall. Der Teig wird aus Mittelglutenmehl mit warmem Wasser hergestellt, geknetet und gehen gelassen, um dünne und widerstandsfähige Haut zu gewährleisten; die Füllung verwendet Schweinevorderlauf mit gehacktem Hautgelee, das während des Dämpfens zu Suppe schmilzt. Die Dämpfzeit beträgt 8-10 Minuten, um gebrochene Haut, ausgelaufene Suppe oder ungekochte Füllung zu vermeiden. Beim Essen zuerst ein kleines Loch beißen, um die Suppe abzusaugen und Verbrennungen zu verhindern, und mit Essig und Ingwerstreifen servieren, um Fettigkeit zu reduzieren. Kurzvideos zeigen die dünne und durchscheinende Haut des Brötchens und den Moment, in dem Suppe herausfließt, wenn gebissen wird."
      }
    }
  },
  {
    id: "19",
    category: "xian",
    priceCents: 2600,
    tastes: [
      { zh: "咸鲜", en: "Salty and Savory", de: "Salzig und Herzhaft" },
      { zh: "浓郁", en: "Rich", de: "Reichhaltig" }
    ],
    ingredients: [
      { zh: "面粉", en: "Flour", de: "Mehl" },
      { zh: "土豆", en: "Potato", de: "Kartoffel" },
      { zh: "胡萝卜", en: "Carrot", de: "Karotte" },
      { zh: "豆腐", en: "Tofu", de: "Tofu" },
      { zh: "青菜", en: "Green Vegetables", de: "Grüngemüse" },
      { zh: "瘦肉", en: "Lean Meat", de: "Mageres Fleisch" },
      { zh: "姜片", en: "Ginger Slices", de: "Ingwerscheiben" },
      { zh: "葱段", en: "Scallion Sections", de: "Frühlingszwiebelstücke" },
      { zh: "酱油", en: "Soy Sauce", de: "Sojasauce" }
    ],
    thumbnailUrl: "/images/huimashi-thumb.jpg",
    imageUrl: "/images/huimashi.jpg",
    translations: {
      zh: {
        name: "烩麻食",
        shortDescription: "西安家常主食，口感筋道、食材丰富",
        detailedDescription: "是西安家常主食，“麻食”由面粉加水搓条后捻成猫耳朵状，口感筋道。搭多种食材，加瘦肉片烩煮，汤汁浓稠。手工麻食更筋道，捻制留纹路吸汤汁，烩煮先炒香食材再加水增味，适合秋冬食用，短视频展示手工捻麻食过程与成品分量"
      },
      en: {
        name: "Hui Ma Shi",
        shortDescription: "A Xi'an homely staple, chewy texture, rich ingredients.",
        detailedDescription: "It is a homely staple in Xi'an. 'Mashi' is made by kneading flour with water into strips and then twisting into cat-ear shapes, resulting in a chewy texture. It is cooked with various ingredients and lean meat slices in a thick soup. Handmade mashi is more chewy, and the twisting leaves patterns that absorb the soup. When stewing, the ingredients are first stir-fried for fragrance before adding water to enhance flavor. It is suitable for autumn and winter consumption. Short videos show the process of hand-twisting mashi and the final portion."
      },
      de: {
        name: "Hui Ma Shi",
        shortDescription: "Ein Xi'an hausgemachtes Hauptnahrungsmittel, zähe Textur, reichhaltige Zutaten.",
        detailedDescription: "Es ist ein hausgemachtes Hauptnahrungsmittel in Xi'an. 'Mashi' wird hergestellt, indem Mehl mit Wasser zu Streifen geknetet und dann zu Katzenohrformen gedreht wird, was zu einer zähen Textur führt. Es wird mit verschiedenen Zutaten und mageren Fleischscheiben in einer dicken Suppe gekocht. Handgemachtes Mashi ist zäher, und das Drehen hinterlässt Muster, die die Suppe absorbieren. Beim Schmoren werden die Zutaten zuerst für Duft angebraten, bevor Wasser hinzugefügt wird, um den Geschmack zu verbessern. Es eignet sich für den Verzehr im Herbst und Winter. Kurzvideos zeigen den Prozess des Handdrehens von Mashi und die endgültige Portion."
      }
    }
  },
  {
    id: "20",
    category: "xian",
    priceCents: 1800,
    tastes: [
      { zh: "甜而不腻", en: "Sweet but Not Greasy", de: "Süß aber nicht fettig" },
      { zh: "软糯", en: "Soft and Glutinous", de: "Weich und Klebrig" }
    ],
    ingredients: [
      { zh: "柿子", en: "Persimmon", de: "Kaki" },
      { zh: "面粉", en: "Flour", de: "Mehl" },
      { zh: "糖", en: "Sugar", de: "Zucker" }
    ],
    thumbnailUrl: "/images/huanggui-shibing-thumb.jpg",
    imageUrl: "/images/huanggui-shibing.jpg",
    translations: {
      zh: {
        name: "黄桂柿子饼",
        shortDescription: "西安传统甜点，金黄酥脆、香甜可口",
        detailedDescription: "黄桂柿子饼是西安传统甜点，以柿子和面粉为主要原料，经油炸制成，外皮金黄酥脆，内馅香甜软糯。"
      },
      en: {
        name: "Huang Gui Shi Zi Bing",
        shortDescription: "A traditional Xi'an sweet pastry, golden and crispy, sweet and delicious.",
        detailedDescription: "Huang Gui Shi Zi Bing is a traditional Xi'an sweet pastry, made mainly from persimmons and flour, deep-fried until the exterior is golden and crispy, and the filling is sweet and soft."
      },
      de: {
        name: "Huang Gui Shi Zi Bing",
        shortDescription: "Ein traditionelles Xi'an süßes Gebäck, gold und knusprig, süß und lecker.",
        detailedDescription: "Huang Gui Shi Zi Bing ist ein traditionelles Xi'an süßes Gebäck, hauptsächlich aus Kaki und Mehl hergestellt, frittiert bis die Außenseite gold und knusprig ist und die Füllung süß und weich ist."
      }
    }
  }
];
