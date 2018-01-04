DROP VIEW IF EXISTS `v_passenger`;
CREATE VIEW v_passenger
AS
SELECT a.*,b.deck_num,b.muster_station
FROM passenger_info a
LEFT JOIN muster_station b
ON a.cabin_num = b.cabin_num and a.ship_id = b.ship_id;

update cruise_cal set cruiseName = Replace(cruiseName,'歌诗达','')