package entity

type WeatherLog struct {
	Latitude               float64 `json:"latitude"`
	Longitude              float64 `json:"longitude"`
	Timestamp              string  `json:"timestamp"`
	Temperature            float64 `json:"temperature"`
	Humidity               int     `json:"humidity"`
	WindSpeed              float64 `json:"wind_speed"`
	CloudCover             int     `json:"cloud_cover"`
	ShortwaveRadiation     float64 `json:"shortwave_radiation"`
	DirectNormalIrradiance float64 `json:"direct_normal_irradiance"`
	DiffuseRadiation       float64 `json:"diffuse_radiation"`
	GlobalTiltedIrradiance float64 `json:"global_tilted_irradiance"`
	SunshineDuration       float64 `json:"sunshine_duration"`
	Condition              string  `json:"condition"`
}
