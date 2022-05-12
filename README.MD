## Application répartie - API

### Installation

[Mongodb](https://www.mongodb.com/try/download/community?tck=docs_server) est nécéssaire pour lancer l'API. Seul la partie server de mongodb est nécéssaire, Compass est inutile.

[Nodejs](https://nodejs.org/en/download/) est également nécéssaire.

Dans un intérpréteur de commandes, déplacez-vous dans un dossier sans les droits administrateurs, puis clônez ce dépôt :

```bash
git clone https://github.com/Wiltoag/appli-rep-api.git
```

Démarrez la base de données :
```bash
mongod --port 27017 --dbpath db
```
*Les données de la base de données seront dans le dossier `db`.*

Initialisez via `npm` :
```bash
npm i
```

Compilez les scripts typescript :
```bash
npx tsc
```

Enfin lancez l'API :
```bash
node src/app.js
# ou alors, pour le développement, permet de réactualiser les fichiers modifiés
npx nodemon src/app.js
```

L'API tournera sur le port `16548`.

### Endpoints :

- `POST host:16548/user/login` pour se connecter en tant qu'utilisateur (vacancier) avec un id et mot de passe. Retourne un token.
- `POST host:16548/owner/login` pour se connecter en tant que propriétaire avec un id et mot de passe. Retourne un token.
- `POST host:16548/user/register` pour créer un compte en tant qu'utilisateur (vacancier). Retourne un token.
- `POST host:16548/owner/register` pour créer un compte en tant que propriétaire. Retourne un token.
- `POST host:16548/user/generate-token` pour regénérer le token d'un utilisateur (vacancier). Retourne un token.
- `POST host:16548/owner/generate-token` pour regénérer le token d'un propriétaire. Retourne un token.
- `POST host:16548/user/change-pass` pour changer le mot de passe d'un utilisateur (vacancier). Régénère également le token. Retourne un token.
- `POST host:16548/owner/change-pass` pour changer le mot de passe d'un propriétaire. Régénère également le token. Retourne un token.
- `GET host:16548/campings` Renvoie une liste de tous les campings disponibles.
- `GET host:16548/campings/me` Renvoie une liste de tous les campings posté par le propriétaire. Nécéssite un token de propriétaire.