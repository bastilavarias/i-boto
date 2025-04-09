import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Candidate from '#models/candidate'

export default class extends BaseSeeder {
  async run() {
    const candidates = [
      {
        name: 'ABALOS, BENHUR',
        party: 'PFP',
        code: 'ABALOSBENHUR2025',
      },
      {
        name: 'ADONIS, JEROME',
        party: 'MKBYN',
        code: 'ADONISJEROME2025',
      },
      {
        name: 'AMAD, WILSON',
        party: 'IND',
        code: 'AMADWILSON2025',
      },
      {
        name: 'ANDAMO, NARS ALYN',
        party: 'MKBYN',
        code: 'ANDAMONARSALYN2025',
      },
      {
        name: 'AQUINO, BAM',
        party: 'KNP',
        code: 'AQUINOBAM2025',
      },
      {
        name: 'ARAMBULO, RONNEL',
        party: 'MKBYN',
        code: 'ARAMBULORONNEL2025',
      },
      {
        name: 'ARELLANO, ERNESTO',
        party: 'KTPNAN',
        code: 'ARELLANOERNESTO2025',
      },
      {
        name: 'BALLON, ROBERTO',
        party: 'IND',
        code: 'BALLONROBERTO2025',
      },
      {
        name: 'BINAY, ABBY',
        party: 'NPC',
        code: 'BINAYABBY2025',
      },
      {
        name: 'BONDOC, JIMMY',
        party: 'PDPLBN',
        code: 'BONDOCJIMMY2025',
      },
      {
        name: 'BORJA REVILLA, RAMON, JR.',
        party: 'LAKAS',
        code: 'BORJAREVILLARAMONJR2025',
      },
      {
        name: 'BOSITA, COLONEL',
        party: 'IND',
        code: 'BOSITACOLONEL2025',
      },
      {
        name: 'BROSAS, ARLENE',
        party: 'MKBYN',
        code: 'BROSASARLENE2025',
      },
      {
        name: 'CABONEGRO, ROY',
        party: 'DPP',
        code: 'CABONEGROROY2025',
      },
      {
        name: 'CAPUYAN, ALLEN',
        party: 'PPP',
        code: 'CAPUYANALLEN2025',
      },
      {
        name: 'CASIÑO, TEDDY',
        party: 'MKBYN',
        code: 'CASINOTEDDY2025',
      },
      {
        name: 'CASTRO, TEACHER FRANCE',
        party: 'MKBYN',
        code: 'CASTROTEACHERFRANCE2025',
      },
      {
        name: 'CAYETANO, PIA',
        party: 'NP',
        code: 'CAYETANOPIA2025',
      },
      {
        name: "D'ANGELO, DAVID",
        party: 'BUMYOG',
        code: 'DANGELODAVID2025',
      },
      {
        name: 'DE ALBAN, ATTORNEY ANGELO',
        party: 'IND',
        code: 'DEALBANATTORNEYANGELO2025',
      },
      {
        name: 'DE GUZMAN, KA LEODY',
        party: 'PLM',
        code: 'DEGUZMANKALEODY2025',
      },
      {
        name: 'DELA ROSA, BATO',
        party: 'PDPLBN',
        code: 'DELAROSABATO2025',
      },
      {
        name: 'DOMINGO, NANAY MIMI',
        party: 'MKBYN',
        code: 'DOMINGONANAYMIMI2025',
      },
      {
        name: 'ESCOBAL, ARNEL',
        party: 'PM',
        code: 'ESCOBALARNEL2025',
      },
      {
        name: 'ESPIRITU, LUKE',
        party: 'PLM',
        code: 'ESPIRITULUKE2025',
      },
      {
        name: 'FLORANDA, MODY PISTON',
        party: 'MKBYN',
        code: 'FLORANDAMODYPISTON2025',
      },
      {
        name: 'GAMBOA, MARC LOUIE',
        party: 'IND',
        code: 'GAMBOAMARCLOUIE2025',
      },
      {
        name: 'GO, BONG GO',
        party: 'PDPLBN',
        code: 'GOBONGG2025',
      },
      {
        name: 'GONZALES, NORBERTO',
        party: 'PDP',
        code: 'GONZALESNORBERTO2025',
      },
      {
        name: 'HINLO, JAYVEE',
        party: 'PDPLBN',
        code: 'HINLOJAYVEE2025',
      },
      {
        name: 'HONASAN, GRINGO',
        party: 'RP',
        code: 'HONASANGRINGO2025',
      },
      {
        name: 'JOSE, RELLY JR.',
        party: 'KBL',
        code: 'JOSERELLYJR2025',
      },
      {
        name: 'LACSON, PING',
        party: 'IND',
        code: 'LACSONPING2025',
      },
      {
        name: 'LAMBINO, RAUL',
        party: 'NP',
        code: 'LAMBINORAUL2025',
      },
      {
        name: 'LAPID, LITO',
        party: 'NPC',
        code: 'LAPIDLITO2025',
      },
      {
        name: 'LEE, MANOY WILBERT',
        party: 'AKSYON',
        code: 'LEEMANOYWILBERT2025',
      },
      {
        name: 'LIDASAN, AMIRAH',
        party: 'MKBYN',
        code: 'LIDASANAMIRAH2025',
      },
      {
        name: 'MARCOLETA, RODANTE',
        party: 'IND',
        code: 'MARCOLETARODANTE2025',
      },
      {
        name: 'MARCOS, IMEE R.',
        party: 'NP',
        code: 'MARCOSIMEER2025',
      },
      {
        name: 'MARQUEZ, NORMAN',
        party: 'IND',
        code: 'MARQUEZNORMAN2025',
      },
      {
        name: 'MARTINEZ, ERIC',
        party: 'IND',
        code: 'MARTINEZERIC2025',
      },
      {
        name: 'MATA, DOC MARITES',
        party: 'IND',
        code: 'MATADOCMARITES2025',
      },
      {
        name: 'MATULA, ATTY. SONNY',
        party: 'WPP',
        code: 'MATULAATTYSONNY2025',
      },
      {
        name: 'MAZA, LIZA',
        party: 'MKBYN',
        code: 'MAZALIZA2025',
      },
      {
        name: 'MENDOZA, HEIDI',
        party: 'IND',
        code: 'MENDOZAHEIDI2025',
      },
      {
        name: 'MONTEMAYOR, JOEY',
        party: 'IND',
        code: 'MONTEMAYORJOEY2025',
      },
      {
        name: 'MUSTAPHA, SUBAIR',
        party: 'WPP',
        code: 'MUSTAPHASUBAIR2025',
      },
      {
        name: 'OLIVAR, JOSE JESSIE',
        party: 'IND',
        code: 'OLIVARJOSEJESSIE2025',
      },
      {
        name: 'ONG, DOC WILLIE',
        party: 'AKSYON',
        code: 'ONGDOCWILLIE2025',
      },
      {
        name: 'PACQUIAO, MANNY PACMAN',
        party: 'PFP',
        code: 'PACQUIAOMANNYPACMAN2025',
      },
      {
        name: 'PANGILINAN, KIKO',
        party: 'LP',
        code: 'PANGILINANKIKO2025',
      },
      {
        name: 'QUERUBIN, ARIEL PORFIRIO',
        party: 'NP',
        code: 'QUERUBINARIELPORFIRIO2025',
      },
      {
        name: 'QUIBOLOY, APOLLO',
        party: 'IND',
        code: 'QUIBOLOYAPOLLO2025',
      },
      {
        name: 'RAMOS, DANILO',
        party: 'MKBYN',
        code: 'RAMOSDANILO2025',
      },
      {
        name: 'REVILLAME, WILLIE WIL',
        party: 'IND',
        code: 'REVILLAMEWILLIEWIL2025',
      },
      {
        name: 'RODRIGUEZ, ATTY. VIC',
        party: 'IND',
        code: 'RODRIGUEZATTYVIC2025',
      },
      {
        name: 'SAHIDULLA, NUR-ANA',
        party: 'IND',
        code: 'SAHIDULLANURANA2025',
      },
      {
        name: 'SALVADOR, PHILLIP IPE',
        party: 'PDPLBN',
        code: 'SALVADORPHILLIPIPE2025',
      },
      {
        name: 'SOTTO, TITO',
        party: 'NPC',
        code: 'SOTTOTITO2025',
      },
      {
        name: 'TAPADO, MICHAEL BONGBONG',
        party: 'PM',
        code: 'TAPADOMICHAELBONGBONG2025',
      },
      {
        name: 'TOLENTINO, FRANCIS TOL',
        party: 'PFP',
        code: 'TOLENTINOFRANCISTOL2025',
      },
      {
        name: 'TULFO, BEN BITAG',
        party: 'IND',
        code: 'TULFOBENBITAG2025',
      },
      {
        name: 'TULFO, ERWIN',
        party: 'LAKAS',
        code: 'TULFOERWIN2025',
      },
      {
        name: 'VALBUENA, MAR MANIBELA',
        party: 'IND',
        code: 'VALBUENAMARMANIBELA2025',
      },
      {
        name: 'VERCELES, LEANDRO',
        party: 'IND',
        code: 'VERCELESLEANDRO2025',
      },
      {
        name: 'VILLAR, CAMILLE',
        party: 'NP',
        code: 'VILLARCAMILLE2025',
      },
    ]

    for (const candidate of candidates) {
      const index = candidates.indexOf(candidate)
      await Candidate.create({
        placement: index + 1,
        name: candidate.name,
        party: candidate.party,
        code: candidate.code,
        position: 'senate',
        electionYear: '2025',
      })
    }
  }
}
