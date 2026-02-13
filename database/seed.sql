-- ============================================
-- Seed Data — Sample Hotel Menu Items
-- ============================================

INSERT INTO foods (name, category, price, available) VALUES
    -- Breakfast
    ('Pancakes with Maple Syrup',    'Breakfast', 8.99,  true),
    ('Eggs Benedict',                'Breakfast', 12.50, true),
    ('French Toast',                 'Breakfast', 9.99,  true),
    ('Avocado Toast',                'Breakfast', 10.99, true),
    ('Omelette (Cheese & Herbs)',    'Breakfast', 7.99,  true),

    -- Lunch
    ('Grilled Chicken Caesar Salad', 'Lunch',     14.99, true),
    ('Club Sandwich',                'Lunch',     11.50, true),
    ('Margherita Pizza',             'Lunch',     13.99, true),
    ('Beef Burger with Fries',       'Lunch',     15.99, true),
    ('Pasta Alfredo',                'Lunch',     12.99, false),

    -- Dinner
    ('Grilled Salmon Fillet',        'Dinner',    22.99, true),
    ('Lamb Chops with Rosemary',     'Dinner',    26.50, true),
    ('Mushroom Risotto',             'Dinner',    18.99, true),
    ('Filet Mignon',                 'Dinner',    34.99, true),
    ('Lobster Thermidor',            'Dinner',    42.00, false),

    -- Drinks
    ('Fresh Orange Juice',           'Drinks',    4.99,  true),
    ('Cappuccino',                   'Drinks',    5.50,  true),
    ('Mango Smoothie',               'Drinks',    6.99,  true),
    ('Sparkling Water',              'Drinks',    2.99,  true),
    ('Classic Mojito',               'Drinks',    9.99,  true);
