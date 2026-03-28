INSERT INTO wards (id, name) VALUES
(1, 'Ward 1'), (2, 'Ward 2'), (3, 'Ward 3'),
(4, 'Ward 4'), (5, 'Ward 5'), (6, 'Ward 6'),
(7, 'Ward 7'), (8, 'Ward 8'), (9, 'Ward 9'),
(10, 'Ward 10'), (11, 'Ward 11'), (12, 'Ward 12'),
(13, 'Ward 13'), (14, 'Ward 14'), (15, 'Ward 15')
ON CONFLICT (id) DO NOTHING;
