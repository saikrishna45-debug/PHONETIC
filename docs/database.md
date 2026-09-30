# Database Architecture & Schema Design

## Database Engine
- **Engine**: PostgreSQL 15+
- **Driver**: `asyncpg` / `psycopg2`
- **Migrations**: Alembic

## Core Entities
1. **Users**: Credentials, preferences, profile settings
2. **Phones**: Smartphone catalog, specs (RAM, storage, camera, SoC, battery, release year, base price)
3. **ResalePredictions**: User resale estimation records, entered condition, predicted price
4. **Recommendations**: Generated recommendation sessions and chosen criteria
5. **SavedPhones**: User bookmarks and wishlists
6. **ActivityLogs**: Audit and history of predictions, searches, and interactions
