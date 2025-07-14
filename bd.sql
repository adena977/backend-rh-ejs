




CREATE TABLE mouvements_rh (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employe_id INT NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  FOREIGN KEY (employe_id) REFERENCES employes(id) ON DELETE CASCADE
);




CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  destinataire_id INT NOT NULL,
  message TEXT NOT NULL,
  date_envoi DATETIME DEFAULT CURRENT_TIMESTAMP,
  lue BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (destinataire_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

CREATE TABLE logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  utilisateur_id INT NOT NULL,
  action TEXT NOT NULL,
  table_modifiee VARCHAR(100),
  id_element INT,
  date_action DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

