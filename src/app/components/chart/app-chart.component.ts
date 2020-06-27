import { map } from "rxjs/operators";
import { ChartDataService } from "./../../services/chart-data.service";
import { GraphDataService } from "./../../services/graph-data.service";
import { Component } from "@angular/core";
// import { multi } from "./data";

@Component({
  selector: "app-chart",
  templateUrl: "./app-chart.component.html",
  styleUrls: ["./app-chart.component.scss"],
})
export class AppChartComponent {
  multi: any[];
  view: any[] = [700, 300];
  countedCharsChartData;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = "Characters";
  showYAxisLabel = true;
  yAxisLabel = "# of episodes";

  colorScheme1 = {
    domain: ["#5AA454", "#E44D25", "#CFC0BB", "#7aa3e5", "#a8385d", "#aae3f5"],
  };
  colorScheme2 = {
    domain: [
      "#BCC4DB",
      "#C0A9B0",
      "#7880B5",
      "#6987C9",
      "#6BBAEC",
      "#beb7c6",
      "#6aa1db",
      "#7184BF",
    ],
  };

  constructor(public chartDataService: ChartDataService) {
    chartDataService.countedCharsChartData$
      .pipe(
        map((data: any[]) => {
          console.log(data);
          console.log("bingo", data.slice(0, 50));
          data.sort((a, b) => b.value - a.value);
          return data.slice(0, 50);
        })
      )
      .subscribe((x) => (this.countedCharsChartData = x));
  }

  onSelect(data): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }

  testdata() {
    return [
      {
        name: "LOCUTUS",
        value: 1,
      },
      {
        name: "CAPTAIN",
        value: 4,
      },
      {
        name: "OPS OFFICER",
        value: 1,
      },
      {
        name: "SISKO",
        value: 173,
      },
      {
        name: "TACTICAL",
        value: 1,
      },
      {
        name: "COMPUTER",
        value: 67,
      },
      {
        name: "ENSIGN",
        value: 2,
      },
      {
        name: "CREWMAN",
        value: 19,
      },
      {
        name: "CREWWOMAN",
        value: 9,
      },
      {
        name: "JAKE",
        value: 73,
      },
      {
        name: "O'BRIEN",
        value: 159,
      },
      {
        name: "MONK",
        value: 1,
      },
      {
        name: "KIRA",
        value: 172,
      },
      {
        name: "BUREAUCRAT",
        value: 1,
      },
      {
        name: "ODO",
        value: 168,
      },
      {
        name: "NOG",
        value: 46,
      },
      {
        name: "QUARK",
        value: 156,
      },
      {
        name: "PICARD",
        value: 1,
      },
      {
        name: "OPAKA",
        value: 4,
      },
      {
        name: "JENNIFER",
        value: 3,
      },
      {
        name: "PIT BOSS",
        value: 1,
      },
      {
        name: "GIRL",
        value: 8,
      },
      {
        name: "ALIEN",
        value: 1,
      },
      {
        name: "BASHIR",
        value: 174,
      },
      {
        name: "DAX",
        value: 149,
      },
      {
        name: "LIEUTENANT",
        value: 1,
      },
      {
        name: "MAGGIE",
        value: 1,
      },
      {
        name: "DUKAT",
        value: 34,
      },
      {
        name: "CARDASSIAN",
        value: 14,
      },
      {
        name: "CARDASSIAN 2",
        value: 1,
      },
      {
        name: "BATSMAN",
        value: 1,
      },
      {
        name: "SISKO 2",
        value: 1,
      },
      {
        name: "JENNIFER 2",
        value: 1,
      },
      {
        name: "PICARD ALIEN",
        value: 1,
      },
      {
        name: "CONN OFFICER",
        value: 1,
      },
      {
        name: "JASAD",
        value: 1,
      },
      {
        name: "CARDASSIAN 3",
        value: 1,
      },
      {
        name: "GARAK",
        value: 38,
      },
      {
        name: "TAHNA",
        value: 1,
      },
      {
        name: "GUL DANAR",
        value: 1,
      },
      {
        name: "ROLLMAN",
        value: 2,
      },
      {
        name: "DEPUTY",
        value: 3,
      },
      {
        name: "LURSA",
        value: 1,
      },
      {
        name: "B'ETOR",
        value: 1,
      },
      {
        name: "KEIKO",
        value: 21,
      },
      {
        name: "IRUDAN",
        value: 1,
      },
      {
        name: "IBUDAN",
        value: 1,
      },
      {
        name: "WAITER",
        value: 2,
      },
      {
        name: "DABO GIRL",
        value: 2,
      },
      {
        name: "WOMAN",
        value: 13,
      },
      {
        name: "MAN",
        value: 28,
      },
      {
        name: "ZAYRA",
        value: 1,
      },
      {
        name: "OFFICER",
        value: 7,
      },
      {
        name: "ROM",
        value: 35,
      },
      {
        name: "BAJORAN",
        value: 8,
      },
      {
        name: "VOICE",
        value: 7,
      },
      {
        name: "NURSE",
        value: 9,
      },
      {
        name: "MOLLY",
        value: 12,
      },
      {
        name: "CROWD",
        value: 12,
      },
      {
        name: "SECURITY",
        value: 22,
      },
      {
        name: "MALE",
        value: 3,
      },
      {
        name: "LAMONAY",
        value: 1,
      },
      {
        name: "JAHEEL",
        value: 1,
      },
      {
        name: "ASOTH",
        value: 1,
      },
      {
        name: "JABARA",
        value: 2,
      },
      {
        name: "GALIS",
        value: 1,
      },
      {
        name: "SURMAK",
        value: 1,
      },
      {
        name: "SARDA",
        value: 1,
      },
      {
        name: "TOSK",
        value: 1,
      },
      {
        name: "HUNTER",
        value: 1,
      },
      {
        name: "VASH",
        value: 1,
      },
      {
        name: "CLERK",
        value: 1,
      },
      {
        name: "KOLOS",
        value: 1,
      },
      {
        name: "PEERS",
        value: 1,
      },
      {
        name: "TANDRO",
        value: 1,
      },
      {
        name: "RENORA",
        value: 1,
      },
      {
        name: "ENINA",
        value: 1,
      },
      {
        name: "KAJADA",
        value: 1,
      },
      {
        name: "VANTIKA",
        value: 1,
      },
      {
        name: "PRIMMIN",
        value: 2,
      },
      {
        name: "DURG",
        value: 1,
      },
      {
        name: "FALOW",
        value: 1,
      },
      {
        name: "CHANDRA",
        value: 1,
      },
      {
        name: "KRAX",
        value: 1,
      },
      {
        name: "ZEK",
        value: 7,
      },
      {
        name: "GRAL",
        value: 1,
      },
      {
        name: "NAVA",
        value: 1,
      },
      {
        name: "RO-KEL",
        value: 1,
      },
      {
        name: "AH-KEL",
        value: 1,
      },
      {
        name: "CRODEN",
        value: 1,
      },
      {
        name: "HADRAN",
        value: 1,
      },
      {
        name: "YARETH",
        value: 1,
      },
      {
        name: "VULCAN",
        value: 2,
      },
      {
        name: "ENNIS",
        value: 1,
      },
      {
        name: "SHEL-LA",
        value: 1,
      },
      {
        name: "NOL",
        value: 1,
      },
      {
        name: "ZLANGCO",
        value: 1,
      },
      {
        name: "VARIS",
        value: 1,
      },
      {
        name: "FAREN",
        value: 1,
      },
      {
        name: "HOVATH",
        value: 1,
      },
      {
        name: "WOBAN",
        value: 1,
      },
      {
        name: "SIRAH",
        value: 1,
      },
      {
        name: "TORAN",
        value: 2,
      },
      {
        name: "MULLIBOK",
        value: 1,
      },
      {
        name: "CH'ANO",
        value: 1,
      },
      {
        name: "RUMPELSTILTSKIN",
        value: 1,
      },
      {
        name: "BUCK",
        value: 1,
      },
      {
        name: "DAX 2",
        value: 1,
      },
      {
        name: "TAXCO",
        value: 1,
      },
      {
        name: "VADOSIA",
        value: 1,
      },
      {
        name: "LOJAL",
        value: 1,
      },
      {
        name: "LWAXANA",
        value: 3,
      },
      {
        name: "ANARA",
        value: 1,
      },
      {
        name: "KLINGON",
        value: 7,
      },
      {
        name: "VALERIAN",
        value: 1,
      },
      {
        name: "GUARD",
        value: 13,
      },
      {
        name: "MARRITZA",
        value: 1,
      },
      {
        name: "KAINON",
        value: 1,
      },
      {
        name: "KAVAL",
        value: 1,
      },
      {
        name: "NEELA",
        value: 2,
      },
      {
        name: "WINN",
        value: 14,
      },
      {
        name: "VENDOR",
        value: 2,
      },
      {
        name: "BAREIL",
        value: 8,
      },
      {
        name: "VOICES",
        value: 5,
      },
      {
        name: "OVERSEER",
        value: 1,
      },
      {
        name: "BORUM",
        value: 1,
      },
      {
        name: "JARO",
        value: 3,
      },
      {
        name: "DOEK",
        value: 1,
      },
      {
        name: "KRIM",
        value: 2,
      },
      {
        name: "ZEF'NO",
        value: 1,
      },
      {
        name: "REBEL",
        value: 1,
      },
      {
        name: "CHEKOTE",
        value: 1,
      },
      {
        name: "DAY",
        value: 1,
      },
      {
        name: "SOLDIER",
        value: 4,
      },
      {
        name: "VERAD",
        value: 1,
      },
      {
        name: "T'KAR",
        value: 1,
      },
      {
        name: "MAREEL",
        value: 1,
      },
      {
        name: "YETO",
        value: 1,
      },
      {
        name: "ZOLAN",
        value: 1,
      },
      {
        name: "PROKA",
        value: 1,
      },
      {
        name: "RUGAL",
        value: 1,
      },
      {
        name: "DEELA",
        value: 1,
      },
      {
        name: "ASHA",
        value: 1,
      },
      {
        name: "PA'DAR",
        value: 1,
      },
      {
        name: "JOMAT",
        value: 1,
      },
      {
        name: "MELORA",
        value: 1,
      },
      {
        name: "ASHROCK",
        value: 1,
      },
      {
        name: "FALLIT",
        value: 1,
      },
      {
        name: "CHEF",
        value: 3,
      },
      {
        name: "FALLIT KOT",
        value: 1,
      },
      {
        name: "PEL",
        value: 3,
      },
      {
        name: "INGLATU",
        value: 1,
      },
      {
        name: "ZYREE",
        value: 1,
      },
      {
        name: "DOSI",
        value: 1,
      },
      {
        name: "DOSI 2",
        value: 1,
      },
      {
        name: "PALLRA",
        value: 1,
      },
      {
        name: "TRAZKO",
        value: 1,
      },
      {
        name: "COMM",
        value: 2,
      },
      {
        name: "FENNA",
        value: 1,
      },
      {
        name: "SEYETIK",
        value: 1,
      },
      {
        name: "NIDELL",
        value: 1,
      },
      {
        name: "PIERSALL",
        value: 1,
      },
      {
        name: "VARANI",
        value: 1,
      },
      {
        name: "TUMAK",
        value: 1,
      },
      {
        name: "HANEEK",
        value: 1,
      },
      {
        name: "GAI",
        value: 1,
      },
      {
        name: "COWL",
        value: 1,
      },
      {
        name: "VAYNA",
        value: 1,
      },
      {
        name: "ROZAHN",
        value: 1,
      },
      {
        name: "SORAD",
        value: 1,
      },
      {
        name: "PILOT",
        value: 2,
      },
      {
        name: "HAZAR",
        value: 1,
      },
      {
        name: "ALSIA",
        value: 1,
      },
      {
        name: "MARTUS",
        value: 1,
      },
      {
        name: "COS",
        value: 1,
      },
      {
        name: "ROANA",
        value: 1,
      },
      {
        name: "MORA",
        value: 2,
      },
      {
        name: "WELD",
        value: 1,
      },
      {
        name: "NYDROM",
        value: 1,
      },
      {
        name: "SHARAT",
        value: 1,
      },
      {
        name: "E'TYSHRA",
        value: 1,
      },
      {
        name: "JAKIN",
        value: 1,
      },
      {
        name: "DECURTIS",
        value: 1,
      },
      {
        name: "COUTU",
        value: 1,
      },
      {
        name: "FAKE O'BRIEN",
        value: 1,
      },
      {
        name: "VINOD",
        value: 1,
      },
      {
        name: "JOSEPH",
        value: 7,
      },
      {
        name: "ALIXUS",
        value: 1,
      },
      {
        name: "CASSANDRA",
        value: 1,
      },
      {
        name: "STEPHAN",
        value: 1,
      },
      {
        name: "COLYUS",
        value: 1,
      },
      {
        name: "RURIGAN",
        value: 1,
      },
      {
        name: "TAYA",
        value: 1,
      },
      {
        name: "MERRUK",
        value: 1,
      },
      {
        name: "FEMALE",
        value: 5,
      },
      {
        name: "ARJIN",
        value: 1,
      },
      {
        name: "TRAJOK",
        value: 1,
      },
      {
        name: "NATIMA",
        value: 1,
      },
      {
        name: "HOGUE",
        value: 1,
      },
      {
        name: "REKELEN",
        value: 1,
      },
      {
        name: "KOR",
        value: 3,
      },
      {
        name: "KOLOTH",
        value: 1,
      },
      {
        name: "KANG",
        value: 1,
      },
      {
        name: "ALBINO",
        value: 1,
      },
      {
        name: "GUARD 2",
        value: 2,
      },
      {
        name: "HUDSON",
        value: 2,
      },
      {
        name: "SAKONNA",
        value: 2,
      },
      {
        name: "BOMBER",
        value: 1,
      },
      {
        name: "EVEK",
        value: 1,
      },
      {
        name: "AMAROS",
        value: 2,
      },
      {
        name: "KOBB",
        value: 2,
      },
      {
        name: "SAMUELS",
        value: 1,
      },
      {
        name: "NILES",
        value: 1,
      },
      {
        name: "ADMIRAL",
        value: 1,
      },
      {
        name: "NECHEYEV",
        value: 1,
      },
      {
        name: "PARN",
        value: 1,
      },
      {
        name: "DROFO",
        value: 1,
      },
      {
        name: "DAX [OC",
        value: 1,
      },
      {
        name: "BOHEEKA",
        value: 1,
      },
      {
        name: "TAIN",
        value: 5,
      },
      {
        name: "INTENDANT",
        value: 2,
      },
      {
        name: "TELOK",
        value: 1,
      },
      {
        name: "HUMAN",
        value: 2,
      },
      {
        name: "KLINGON 2",
        value: 1,
      },
      {
        name: "MUSICIAN",
        value: 1,
      },
      {
        name: "EBLAN",
        value: 1,
      },
      {
        name: "KUBUS",
        value: 1,
      },
      {
        name: "BEK",
        value: 1,
      },
      {
        name: "VEDEKS",
        value: 1,
      },
      {
        name: "BOONE",
        value: 1,
      },
      {
        name: "GUL EVEK",
        value: 1,
      },
      {
        name: "MAKBAR",
        value: 1,
      },
      {
        name: "KOVAT",
        value: 1,
      },
      {
        name: "MAQUIS",
        value: 1,
      },
      {
        name: "ERIS",
        value: 2,
      },
      {
        name: "TALAK'TALAN",
        value: 2,
      },
      {
        name: "KEOGH",
        value: 2,
      },
      {
        name: "ENGINEER",
        value: 3,
      },
      {
        name: "EDDINGTON",
        value: 9,
      },
      {
        name: "T'RUL",
        value: 2,
      },
      {
        name: "BOTH",
        value: 4,
      },
      {
        name: "ORNITHAR",
        value: 1,
      },
      {
        name: "NECHAYEV",
        value: 1,
      },
      {
        name: "BORATH",
        value: 1,
      },
      {
        name: "JEM'HADAR",
        value: 11,
      },
      {
        name: "KOZAK",
        value: 1,
      },
      {
        name: "D'GHOR",
        value: 1,
      },
      {
        name: "GRILKA",
        value: 2,
      },
      {
        name: "TUMEK",
        value: 2,
      },
      {
        name: "GOWRON",
        value: 7,
      },
      {
        name: "RENHOL",
        value: 1,
      },
      {
        name: "FIGURE",
        value: 1,
      },
      {
        name: "TIMOR",
        value: 1,
      },
      {
        name: "YOLAD",
        value: 1,
      },
      {
        name: "JORAN",
        value: 3,
      },
      {
        name: "ALENIS",
        value: 1,
      },
      {
        name: "YELN",
        value: 1,
      },
      {
        name: "ENTEK",
        value: 1,
      },
      {
        name: "YTEPPA",
        value: 1,
      },
      {
        name: "GHEMOR",
        value: 2,
      },
      {
        name: "ILIANA",
        value: 1,
      },
      {
        name: "BENIL",
        value: 1,
      },
      {
        name: "KOBHEERIAN",
        value: 1,
      },
      {
        name: "ARI",
        value: 1,
      },
      {
        name: "MARDAH",
        value: 1,
      },
      {
        name: "OKALAR",
        value: 1,
      },
      {
        name: "BOSLIC",
        value: 1,
      },
      {
        name: "BOY",
        value: 2,
      },
      {
        name: "HORTAK",
        value: 1,
      },
      {
        name: "KELL",
        value: 1,
      },
      {
        name: "TIRON",
        value: 1,
      },
      {
        name: "SELTIN",
        value: 1,
      },
      {
        name: "DERAL",
        value: 1,
      },
      {
        name: "LITO",
        value: 1,
      },
      {
        name: "QUARK/KIRA",
        value: 1,
      },
      {
        name: "RIKER",
        value: 1,
      },
      {
        name: "KALITA",
        value: 1,
      },
      {
        name: "TAMAL",
        value: 1,
      },
      {
        name: "KORINAS",
        value: 1,
      },
      {
        name: "GUL DUKAT",
        value: 1,
      },
      {
        name: "RANOR",
        value: 1,
      },
      {
        name: "VIN",
        value: 2,
      },
      {
        name: "BERNARDO",
        value: 2,
      },
      {
        name: "CHRIS",
        value: 2,
      },
      {
        name: "INTERFACE",
        value: 1,
      },
      {
        name: "LEE",
        value: 2,
      },
      {
        name: "WEBB",
        value: 2,
      },
      {
        name: "DANNY",
        value: 2,
      },
      {
        name: "BELL",
        value: 1,
      },
      {
        name: "NEWSCASTER",
        value: 1,
      },
      {
        name: "PRESTON",
        value: 1,
      },
      {
        name: "HIPPIE",
        value: 1,
      },
      {
        name: "GRADY",
        value: 1,
      },
      {
        name: "HENRY",
        value: 1,
      },
      {
        name: "JULIE",
        value: 1,
      },
      {
        name: "POLICE",
        value: 1,
      },
      {
        name: "MEDIC",
        value: 1,
      },
      {
        name: "MEDIC 2",
        value: 1,
      },
      {
        name: "LEANNE",
        value: 1,
      },
      {
        name: "TURREL",
        value: 1,
      },
      {
        name: "RISKA",
        value: 1,
      },
      {
        name: "FOUNDER",
        value: 15,
      },
      {
        name: "YARKA",
        value: 1,
      },
      {
        name: "ULANI",
        value: 1,
      },
      {
        name: "GILORA",
        value: 1,
      },
      {
        name: "DEJAR",
        value: 1,
      },
      {
        name: "EMI",
        value: 1,
      },
      {
        name: "MAIHAR'DU",
        value: 1,
      },
      {
        name: "STARFLEET",
        value: 3,
      },
      {
        name: "BO'RAK",
        value: 1,
      },
      {
        name: "RUWON",
        value: 1,
      },
      {
        name: "O'BRIEN 2",
        value: 1,
      },
      {
        name: "KARINA",
        value: 1,
      },
      {
        name: "MORKA",
        value: 1,
      },
      {
        name: "ATUL",
        value: 1,
      },
      {
        name: "ALTOVAR",
        value: 1,
      },
      {
        name: "TUVOK",
        value: 1,
      },
      {
        name: "RETAYA",
        value: 1,
      },
      {
        name: "ROMULAN",
        value: 6,
      },
      {
        name: "INFORMANT",
        value: 2,
      },
      {
        name: "MILA",
        value: 3,
      },
      {
        name: "LOVOK",
        value: 1,
      },
      {
        name: "TODDMAN",
        value: 1,
      },
      {
        name: "LEETA",
        value: 16,
      },
      {
        name: "LENSE",
        value: 1,
      },
      {
        name: "BRUNT",
        value: 8,
      },
      {
        name: "ISHKA",
        value: 5,
      },
      {
        name: "KASIDY",
        value: 15,
      },
      {
        name: "RECEPTIONIST",
        value: 1,
      },
      {
        name: "SHAKAAR",
        value: 3,
      },
      {
        name: "LUPAZA",
        value: 2,
      },
      {
        name: "FUREL",
        value: 3,
      },
      {
        name: "SYVAR",
        value: 1,
      },
      {
        name: "TROOP",
        value: 1,
      },
      {
        name: "TROOP 2",
        value: 1,
      },
      {
        name: "LEADER",
        value: 1,
      },
      {
        name: "LENARIS",
        value: 1,
      },
      {
        name: "TROOPER",
        value: 1,
      },
      {
        name: "AIDE",
        value: 1,
      },
      {
        name: "GUARDIAN",
        value: 1,
      },
      {
        name: "LELA",
        value: 1,
      },
      {
        name: "TOBIN",
        value: 1,
      },
      {
        name: "EMONY",
        value: 1,
      },
      {
        name: "AUDRID",
        value: 1,
      },
      {
        name: "TORIAS",
        value: 1,
      },
      {
        name: "CURZON",
        value: 1,
      },
      {
        name: "ALL",
        value: 18,
      },
      {
        name: "KRAJENSKY",
        value: 1,
      },
      {
        name: "BOLIAN",
        value: 3,
      },
      {
        name: "ODO 2",
        value: 1,
      },
      {
        name: "MARTOK",
        value: 25,
      },
      {
        name: "DREX",
        value: 1,
      },
      {
        name: "KAYBOK",
        value: 1,
      },
      {
        name: "WORF",
        value: 97,
      },
      {
        name: "HURAGA",
        value: 1,
      },
      {
        name: "WEAPONS",
        value: 1,
      },
      {
        name: "JAKE SR",
        value: 1,
      },
      {
        name: "MELANIE",
        value: 1,
      },
      {
        name: "KORENA",
        value: 1,
      },
      {
        name: "GORAN'AGAR",
        value: 1,
      },
      {
        name: "ARAK'TARAL",
        value: 1,
      },
      {
        name: "TEMO'ZUMA",
        value: 1,
      },
      {
        name: "MESO'CLAN",
        value: 1,
      },
      {
        name: "TOSH",
        value: 1,
      },
      {
        name: "RAZKA",
        value: 1,
      },
      {
        name: "HELER",
        value: 1,
      },
      {
        name: "ZIYAL",
        value: 9,
      },
      {
        name: "PREN",
        value: 1,
      },
      {
        name: "LENARA",
        value: 1,
      },
      {
        name: "BEJAL",
        value: 1,
      },
      {
        name: "HANOK",
        value: 1,
      },
      {
        name: "CARSON",
        value: 1,
      },
      {
        name: "MUNIZ",
        value: 3,
      },
      {
        name: "STEVENS",
        value: 1,
      },
      {
        name: "JANKLOW",
        value: 1,
      },
      {
        name: "WAINWRIGHT",
        value: 1,
      },
      {
        name: "DENNING",
        value: 1,
      },
      {
        name: "CARLSON",
        value: 1,
      },
      {
        name: "GARLAND",
        value: 1,
      },
      {
        name: "LETHEAN",
        value: 1,
      },
      {
        name: "TORAL",
        value: 1,
      },
      {
        name: "CAPRICE",
        value: 1,
      },
      {
        name: "LUVSITT",
        value: 1,
      },
      {
        name: "MONA",
        value: 1,
      },
      {
        name: "PRIEST",
        value: 2,
      },
      {
        name: "'BRIEN",
        value: 1,
      },
      {
        name: "LEYTON",
        value: 2,
      },
      {
        name: "BENTEEN",
        value: 2,
      },
      {
        name: "NATHAN",
        value: 1,
      },
      {
        name: "JARESH-INYO",
        value: 2,
      },
      {
        name: "COMMANDANT",
        value: 1,
      },
      {
        name: "SHEPARD",
        value: 2,
      },
      {
        name: "CHIEF",
        value: 1,
      },
      {
        name: "SARISH",
        value: 1,
      },
      {
        name: "WOMAN 2",
        value: 1,
      },
      {
        name: "MAN 2",
        value: 2,
      },
      {
        name: "JIMENEZ",
        value: 1,
      },
      {
        name: "DAMAR",
        value: 23,
      },
      {
        name: "K'TEMANG",
        value: 1,
      },
      {
        name: "KURN",
        value: 1,
      },
      {
        name: "TILIKIA",
        value: 1,
      },
      {
        name: "NOGGRA",
        value: 1,
      },
      {
        name: "GRIMP",
        value: 2,
      },
      {
        name: "FROOL",
        value: 1,
      },
      {
        name: "PORTA",
        value: 1,
      },
      {
        name: "LATARA",
        value: 1,
      },
      {
        name: "AKOREM",
        value: 1,
      },
      {
        name: "JIA",
        value: 1,
      },
      {
        name: "ONARA",
        value: 1,
      },
      {
        name: "T'LARA",
        value: 1,
      },
      {
        name: "CH'POK",
        value: 1,
      },
      {
        name: "HELM",
        value: 1,
      },
      {
        name: "ARGRATHI",
        value: 1,
      },
      {
        name: "RINN",
        value: 1,
      },
      {
        name: "EE'CHAR",
        value: 1,
      },
      {
        name: "HELMSMAN",
        value: 2,
      },
      {
        name: "PADD",
        value: 1,
      },
      {
        name: "ONAYA",
        value: 1,
      },
      {
        name: "COM",
        value: 1,
      },
      {
        name: "JEYAL",
        value: 1,
      },
      {
        name: "BRATHAW",
        value: 1,
      },
      {
        name: "REESE",
        value: 2,
      },
      {
        name: "OMET'IKLAN",
        value: 1,
      },
      {
        name: "TOMAN'TORAX",
        value: 1,
      },
      {
        name: "VIRAK'KARA",
        value: 1,
      },
      {
        name: "WEYOUN",
        value: 23,
      },
      {
        name: "NORVA",
        value: 1,
      },
      {
        name: "EPRAN",
        value: 1,
      },
      {
        name: "ATTENDANT",
        value: 1,
      },
      {
        name: "PATIENT",
        value: 1,
      },
      {
        name: "TREVEAN",
        value: 1,
      },
      {
        name: "TAMAR",
        value: 1,
      },
      {
        name: "EKORIA",
        value: 1,
      },
      {
        name: "CHILD",
        value: 2,
      },
      {
        name: "LATIA",
        value: 1,
      },
      {
        name: "GINT",
        value: 1,
      },
      {
        name: "AROYA",
        value: 1,
      },
      {
        name: "RIONOJ",
        value: 1,
      },
      {
        name: "AMAT'IGAN",
        value: 1,
      },
      {
        name: "BURLY",
        value: 1,
      },
      {
        name: "DRUNK",
        value: 1,
      },
      {
        name: "YOUNG KLINGON",
        value: 1,
      },
      {
        name: "HOYA",
        value: 1,
      },
      {
        name: "KILANA",
        value: 1,
      },
      {
        name: "THOPOK",
        value: 1,
      },
      {
        name: "KALANDRA",
        value: 1,
      },
      {
        name: "KIRBY",
        value: 1,
      },
      {
        name: "BURKE",
        value: 1,
      },
      {
        name: "MALE GUARD",
        value: 1,
      },
      {
        name: "FEMALE GUARD",
        value: 1,
      },
      {
        name: "WHATLEY",
        value: 2,
      },
      {
        name: "TEKOA",
        value: 1,
      },
      {
        name: "DULMUR",
        value: 1,
      },
      {
        name: "LUCSLY",
        value: 1,
      },
      {
        name: "WADDLE",
        value: 1,
      },
      {
        name: "WATLEY",
        value: 1,
      },
      {
        name: "BARTENDER",
        value: 1,
      },
      {
        name: "JONES",
        value: 2,
      },
      {
        name: "WAITRESS",
        value: 2,
      },
      {
        name: "UHURA",
        value: 1,
      },
      {
        name: "CHEKOV",
        value: 1,
      },
      {
        name: "KIRK",
        value: 1,
      },
      {
        name: "BARIS",
        value: 1,
      },
      {
        name: "KORAX",
        value: 1,
      },
      {
        name: "SCOTT",
        value: 1,
      },
      {
        name: "DARVIN",
        value: 1,
      },
      {
        name: "MCCOY",
        value: 1,
      },
      {
        name: "SPOCK",
        value: 1,
      },
      {
        name: "RISIAN 1",
        value: 1,
      },
      {
        name: "RISIAN 2",
        value: 1,
      },
      {
        name: "ARANDIS",
        value: 1,
      },
      {
        name: "FULLERTON",
        value: 1,
      },
      {
        name: "OKALA",
        value: 1,
      },
      {
        name: "BELAR",
        value: 1,
      },
      {
        name: "THRAX",
        value: 1,
      },
      {
        name: "LATHA",
        value: 1,
      },
      {
        name: "FALA",
        value: 2,
      },
      {
        name: "BRILGAR",
        value: 1,
      },
      {
        name: "SILARAN",
        value: 1,
      },
      {
        name: "Y'PORA",
        value: 1,
      },
      {
        name: "SANDERS",
        value: 1,
      },
      {
        name: "IKAT'IKA",
        value: 2,
      },
      {
        name: "BASHIR 2",
        value: 2,
      },
      {
        name: "DEYOS",
        value: 1,
      },
      {
        name: "ZIMMERMAN",
        value: 1,
      },
      {
        name: "EMH",
        value: 1,
      },
      {
        name: "HOLO-BASHIR",
        value: 1,
      },
      {
        name: "AMSHA",
        value: 1,
      },
      {
        name: "RICHARD",
        value: 1,
      },
      {
        name: "BENNETT",
        value: 1,
      },
      {
        name: "TAUVID",
        value: 1,
      },
      {
        name: "TRAIDY",
        value: 1,
      },
      {
        name: "SORM",
        value: 1,
      },
      {
        name: "ARISSA",
        value: 1,
      },
      {
        name: "IDANIAN",
        value: 1,
      },
      {
        name: "GAILA",
        value: 2,
      },
      {
        name: "HAGATH",
        value: 1,
      },
      {
        name: "CUSTOMER",
        value: 1,
      },
      {
        name: "FARRAKK",
        value: 1,
      },
      {
        name: "REGENT",
        value: 1,
      },
      {
        name: "TABAN",
        value: 2,
      },
      {
        name: "GANTT",
        value: 1,
      },
      {
        name: "LECK",
        value: 2,
      },
      {
        name: "TAVANA",
        value: 1,
      },
      {
        name: "KORNAN",
        value: 1,
      },
      {
        name: "LESKIT",
        value: 1,
      },
      {
        name: "ORTAKIN",
        value: 1,
      },
      {
        name: "CREW",
        value: 1,
      },
      {
        name: "MIRANDA",
        value: 1,
      },
      {
        name: "YEDRIN",
        value: 1,
      },
      {
        name: "GABRIEL",
        value: 1,
      },
      {
        name: "LISA",
        value: 2,
      },
      {
        name: "BROTA",
        value: 1,
      },
      {
        name: "PARELL",
        value: 1,
      },
      {
        name: "REBECCA",
        value: 1,
      },
      {
        name: "BOQ'TA",
        value: 1,
      },
      {
        name: "PECHETTI",
        value: 1,
      },
      {
        name: "STOLZOFF",
        value: 1,
      },
      {
        name: "AMARO",
        value: 1,
      },
      {
        name: "GIGER",
        value: 1,
      },
      {
        name: "ROSS",
        value: 13,
      },
      {
        name: "LIMARA'SON",
        value: 1,
      },
      {
        name: "REMATA'KLAN",
        value: 1,
      },
      {
        name: "KEEVAN",
        value: 2,
      },
      {
        name: "NEELEY",
        value: 1,
      },
      {
        name: "GORDON",
        value: 1,
      },
      {
        name: "YASSIM",
        value: 1,
      },
      {
        name: "N'GAREN",
        value: 1,
      },
      {
        name: "KATOGH",
        value: 1,
      },
      {
        name: "KOTH",
        value: 1,
      },
      {
        name: "DORAN",
        value: 1,
      },
      {
        name: "ALEXANDER",
        value: 2,
      },
      {
        name: "CH'TARGH",
        value: 1,
      },
      {
        name: "SITAK",
        value: 2,
      },
      {
        name: "COBURN",
        value: 1,
      },
      {
        name: "SIRELLA",
        value: 2,
      },
      {
        name: "FERENGI",
        value: 1,
      },
      {
        name: "ATOA",
        value: 1,
      },
      {
        name: "OSSAN",
        value: 1,
      },
      {
        name: "JACK",
        value: 2,
      },
      {
        name: "LOEWS",
        value: 1,
      },
      {
        name: "PATRICK",
        value: 2,
      },
      {
        name: "LAUREN",
        value: 2,
      },
      {
        name: "LOWES",
        value: 1,
      },
      {
        name: "YELGRUN",
        value: 1,
      },
      {
        name: "LARELL",
        value: 1,
      },
      {
        name: "KRIT",
        value: 1,
      },
      {
        name: "NAHSK",
        value: 1,
      },
      {
        name: "HAIN",
        value: 1,
      },
      {
        name: "WILLIE",
        value: 1,
      },
      {
        name: "BENNY",
        value: 2,
      },
      {
        name: "ALBERT",
        value: 1,
      },
      {
        name: "KAY",
        value: 1,
      },
      {
        name: "JULIUS",
        value: 1,
      },
      {
        name: "HERBERT",
        value: 1,
      },
      {
        name: "PABST",
        value: 1,
      },
      {
        name: "ROY",
        value: 1,
      },
      {
        name: "RYAN",
        value: 1,
      },
      {
        name: "MULKAHEY",
        value: 1,
      },
      {
        name: "PREACHER",
        value: 1,
      },
      {
        name: "CASSIE",
        value: 1,
      },
      {
        name: "JIMMY",
        value: 1,
      },
      {
        name: "DARLENE",
        value: 1,
      },
      {
        name: "AMBULANCE MAN",
        value: 1,
      },
      {
        name: "IXTANA'RAX",
        value: 1,
      },
      {
        name: "KUDAK'ETAN",
        value: 1,
      },
      {
        name: "GELNON",
        value: 1,
      },
      {
        name: "LAMAT'UKAN",
        value: 1,
      },
      {
        name: "SIXTH",
        value: 1,
      },
      {
        name: "FLITH",
        value: 1,
      },
      {
        name: "KROLE",
        value: 1,
      },
      {
        name: "BILBY",
        value: 1,
      },
      {
        name: "CHADWICK",
        value: 1,
      },
      {
        name: "YINT",
        value: 1,
      },
      {
        name: "RAIMUS",
        value: 1,
      },
      {
        name: "VORTA",
        value: 1,
      },
      {
        name: "LASARAN",
        value: 1,
      },
      {
        name: "MERU",
        value: 1,
      },
      {
        name: "NERYS",
        value: 1,
      },
      {
        name: "BASSO",
        value: 1,
      },
      {
        name: "REON",
        value: 1,
      },
      {
        name: "GUL",
        value: 1,
      },
      {
        name: "LEGATE",
        value: 1,
      },
      {
        name: "HALB",
        value: 1,
      },
      {
        name: "SLOAN",
        value: 3,
      },
      {
        name: "CHANDLER",
        value: 1,
      },
      {
        name: "KAGAN",
        value: 1,
      },
      {
        name: "TOLAR",
        value: 1,
      },
      {
        name: "VREENAK",
        value: 1,
      },
      {
        name: "VIC",
        value: 8,
      },
      {
        name: "GINGER",
        value: 2,
      },
      {
        name: "MELISSA",
        value: 1,
      },
      {
        name: "LOLA",
        value: 1,
      },
      {
        name: "KORAL",
        value: 1,
      },
      {
        name: "STARBASE",
        value: 1,
      },
      {
        name: "COLLINS",
        value: 1,
      },
      {
        name: "FARRIS",
        value: 1,
      },
      {
        name: "WATTERS",
        value: 1,
      },
      {
        name: "PARTON",
        value: 1,
      },
      {
        name: "CREWWOMAN 2",
        value: 1,
      },
      {
        name: "ALUURA",
        value: 1,
      },
      {
        name: "NILVA",
        value: 1,
      },
      {
        name: "MOLLY 2",
        value: 1,
      },
      {
        name: "PINAR",
        value: 1,
      },
      {
        name: "SAHGI",
        value: 2,
      },
      {
        name: "GLINN",
        value: 1,
      },
      {
        name: "LETANT",
        value: 1,
      },
      {
        name: "CRETAK",
        value: 3,
      },
      {
        name: "EZRI",
        value: 25,
      },
      {
        name: "SIANA",
        value: 1,
      },
      {
        name: "WYKOFF",
        value: 1,
      },
      {
        name: "SARAH",
        value: 4,
      },
      {
        name: "TALPET",
        value: 1,
      },
      {
        name: "SOLOK",
        value: 1,
      },
      {
        name: "ANNOUNCER",
        value: 1,
      },
      {
        name: "NINERS",
        value: 1,
      },
      {
        name: "SARINA",
        value: 1,
      },
      {
        name: "GIRANI",
        value: 1,
      },
      {
        name: "DAROK",
        value: 1,
      },
      {
        name: "KOLANA",
        value: 1,
      },
      {
        name: "SYNON",
        value: 1,
      },
      {
        name: "LARKIN",
        value: 1,
      },
      {
        name: "VARGAS",
        value: 1,
      },
      {
        name: "KELLIN",
        value: 1,
      },
      {
        name: "BRIN",
        value: 1,
      },
      {
        name: "MIKA",
        value: 1,
      },
      {
        name: "BENYAN",
        value: 1,
      },
      {
        name: "MIDWIFE",
        value: 1,
      },
      {
        name: "LADD",
        value: 1,
      },
      {
        name: "PALANCE",
        value: 1,
      },
      {
        name: "DEWILDE",
        value: 1,
      },
      {
        name: "KESHA",
        value: 1,
      },
      {
        name: "YANAS",
        value: 1,
      },
      {
        name: "NORVO",
        value: 1,
      },
      {
        name: "JANEL",
        value: 1,
      },
      {
        name: "FUCHIDA",
        value: 1,
      },
      {
        name: "BOKAR",
        value: 1,
      },
      {
        name: "SMILEY",
        value: 1,
      },
      {
        name: "ILARIO",
        value: 1,
      },
      {
        name: "LAAS",
        value: 1,
      },
      {
        name: "FRANKIE",
        value: 1,
      },
      {
        name: "CICCI",
        value: 1,
      },
      {
        name: "DEALER",
        value: 1,
      },
      {
        name: "ROULETTE",
        value: 1,
      },
      {
        name: "CROUPIER",
        value: 1,
      },
      {
        name: "COUNTMAN",
        value: 1,
      },
      {
        name: "ZEEMO",
        value: 1,
      },
      {
        name: "BLONDE",
        value: 1,
      },
      {
        name: "BARMAN",
        value: 1,
      },
      {
        name: "KOVAL",
        value: 1,
      },
      {
        name: "STARFLEET 2",
        value: 1,
      },
      {
        name: "HICKAM",
        value: 1,
      },
      {
        name: "WHEELER",
        value: 1,
      },
      {
        name: "NERAL",
        value: 1,
      },
      {
        name: "JADZIA",
        value: 1,
      },
      {
        name: "SOLBOR",
        value: 3,
      },
      {
        name: "BREEN",
        value: 3,
      },
      {
        name: "GOR",
        value: 3,
      },
      {
        name: "RUSOT",
        value: 3,
      },
      {
        name: "VOICE 2",
        value: 1,
      },
      {
        name: "KLINGONS",
        value: 1,
      },
      {
        name: "WELDON",
        value: 1,
      },
      {
        name: "HILLIARD",
        value: 1,
      },
      {
        name: "SESKAL",
        value: 2,
      },
      {
        name: "PRAN",
        value: 2,
      },
      {
        name: "VORNAR",
        value: 1,
      },
      {
        name: "LUARAN",
        value: 1,
      },
      {
        name: "JESSICA",
        value: 1,
      },
      {
        name: "AGENT",
        value: 1,
      },
      {
        name: "REVOK",
        value: 1,
      },
      {
        name: "M'PELLA",
        value: 1,
      },
      {
        name: "BROIK",
        value: 1,
      },
      {
        name: "BROCA",
        value: 2,
      },
      {
        name: "LONAR",
        value: 1,
      },
      {
        name: "VELAL",
        value: 1,
      },
      {
        name: "EKOOR",
        value: 1,
      },
      {
        name: "CARDASSIANS",
        value: 1,
      },
    ];
  }

  bla() {
    return [
      {
        name: "SISKO",
        series: [
          {
            name: "Season 1", //dominations
            value: 33, // dominations
          },
          {
            name: "Season 2",
            value: 33,
          },
          {
            name: "Season 3",
            value: 44,
          },
        ],
      },

      {
        name: "USA",
        series: [
          {
            name: "1990",
            value: 250000000,
          },
          {
            name: "2010",
            value: 309000000,
          },
          {
            name: "2011",
            value: 311000000,
          },
        ],
      },

      {
        name: "France",
        series: [
          {
            name: "1990",
            value: 58000000,
          },
          {
            name: "2010",
            value: 50000020,
          },
          {
            name: "2011",
            value: 58000000,
          },
        ],
      },
      {
        name: "UK",
        series: [
          {
            name: "1990",
            value: 57000000,
          },
          {
            name: "2010",
            value: 62000000,
          },
        ],
      },
    ];
  }
}
