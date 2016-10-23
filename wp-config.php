<?php
define('WP_CACHE', true); //Added by WP-Cache Manager
define('TANTAN_DISPLAY_LIBRARY', 'lightbox');
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'sfuita5_test');

/** MySQL database username */
define('DB_USER', 'sfuita5_tester');

/** MySQL database password */
define('DB_PASSWORD', 'Lu+Qx1qU_gwI');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '2p0~e}dfT<V9Z8?Ot`m_z(`1Q(G/vIylZ^a)_vqKIMnR!4lTG!L>^/}%;z$.w;uU');
define('SECURE_AUTH_KEY',  '1Hmyzm_A/e~Wrk.Fq5:XyNQNLjzO@<o>}S:Aya 87#OESE:4djcl~g1 ^e] vTK9');
define('LOGGED_IN_KEY',    'I}2PCcoQM:Kzh-}R)I%uobl$DMmPIfz*9S.G{0+^[2&@Q6^!~|yRJnW)Vmm:=e.+');
define('NONCE_KEY',        '542p4E)twS{B90JQK) C9> V{dlB}xJ*6$z0~=&s`8Z$5J ev(8WU:p!6z:k[?(#');
define('AUTH_SALT',        'G!?1Uo({TZW9uK|W+l&@`v)LCA6j(E`9a7mb3zDT,rE)`=4:GP8|?#;-|9VB}JLB');
define('SECURE_AUTH_SALT', '$^0)-%H8p6;fEAod?1ah6h~-8]{a1-&AielL0XIJl]R=9oNVn^y9U6p|HA9EY/~:');
define('LOGGED_IN_SALT',   ';CICV{%P=b]AJ.qMeV,O;Mj|Vsv*^ hb5NL-?N_kK1+2>^0P_uNZE:^|xQI;QQn[');
define('NONCE_SALT',       'F)ECbm^9w&4mmv||41)XWlk3`i-0T`LGzBSEV|:5[>V#)fKMbeDnW Cs56pjRhhF');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'italia_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress.  A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de.mo to wp-content/languages and set WPLANG to 'de' to enable German
 * language support.
 */
define ('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
