-- ============================================
-- Seed Data — Sample Hotel Menu Items
-- ============================================

INSERT INTO foods (name, category, price, available) VALUES
    -- Breakfast
    ('Pancakes with Maple Syrup',    'Breakfast', 850.00,  true),
    ('Eggs Benedict',                'Breakfast', 1200.00, true),
    ('French Toast',                 'Breakfast', 900.00,  true),
    ('Avocado Toast',                'Breakfast', 1100.00, true),
    ('Omelette (Cheese & Herbs)',    'Breakfast', 750.00,  true),

    -- Lunch
    ('Grilled Chicken Caesar Salad', 'Lunch',     1450.00, true),
    ('Club Sandwich',                'Lunch',     1150.00, true),
    ('Margherita Pizza',             'Lunch',     1350.00, true),
    ('Beef Burger with Fries',       'Lunch',     1550.00, true),
    ('Pasta Alfredo',                'Lunch',     1250.00, false),

    -- Dinner
    ('Grilled Salmon Fillet',        'Dinner',    2800.00, true),
    ('Lamb Chops with Rosemary',     'Dinner',    3200.00, true),
    ('Mushroom Risotto',             'Dinner',    2200.00, true),
    ('Filet Mignon',                 'Dinner',    4200.00, true),
    ('Lobster Thermidor',            'Dinner',    5500.00, false),

    -- Drinks
    ('Fresh Orange Juice',           'Drinks',    450.00,  true),
    ('Cappuccino',                   'Drinks',    500.00,  true),
    ('Mango Smoothie',               'Drinks',    600.00,  true),
    ('Sparkling Water',              'Drinks',    250.00,  true),
    ('Classic Mojito',               'Drinks',    850.00,  true);
