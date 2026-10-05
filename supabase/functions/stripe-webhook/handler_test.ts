import { type Deps, handleEvent } from "./handler.ts";

const LIVE = "cs_live_a1B2c3D4e5F6g7H8";
const paid = {
  id: LIVE,
  payment_link: "plink_1UIbEZQQIEQm1i6qWCLPgt32",
  status: "complete",
  payment_status: "paid",
  created: 1790000000,
  expires_at: 1790086400,
  amount_total: 49500,
  currency: "gbp",
  customer_details: { email: "Sam@Example.com", name: "Sam Example" },
};
const ev = (type: string, id: string) =>
  JSON.stringify({ type, data: { object: { id } } });

function deps(session: unknown, status = 200) {
  const calls: string[] = [];
  const d: Deps = {
    fetchSession: () => Promise.resolve({ status, body: session }),
    upsertSession: (row) => {
      calls.push(`upsert:${row.id}:${row.status}`);
      return Promise.resolve(null);
    },
    alreadyEmailed: () => Promise.resolve(false),
    sendEmail: (t, to, key) => {
      calls.push(`mail:${t}:${to}:${key}`);
      return Promise.resolve(null);
    },
    now: () => new Date("2026-10-05T00:00:00Z"),
  };
  return { d, calls };
}

Deno.test("paid course session is recorded, owner notified, buyer confirmed", async () => {
  const { d, calls } = deps(paid);
  const out = await handleEvent(ev("checkout.session.completed", LIVE), d);
  if (out.status !== 200 || out.body.buyer_confirmation !== true) {
    throw new Error(JSON.stringify(out));
  }
  console.log(calls);
  if (calls.length !== 3) throw new Error("expected 3 calls");
  if (!calls[2].includes(":sam@example.com:")) throw new Error("email case");
});
Deno.test("unpaid, fake, wrong-event and unknown-link are ignored", async () => {
  for (
    const [e, s, st] of [
      [ev("checkout.session.completed", LIVE), {
        ...paid,
        payment_status: "unpaid",
      }, 200],
      [ev("checkout.session.completed", "cs_test_abc12345678"), paid, 200],
      [ev("charge.succeeded", LIVE), paid, 200],
      [ev("checkout.session.completed", LIVE), {
        ...paid,
        payment_link: "plink_x",
      }, 200],
      [ev("checkout.session.completed", LIVE), null, 404],
    ] as [string, unknown, number][]
  ) {
    const { d, calls } = deps(s, st);
    const out = await handleEvent(e, d);
    if (out.status !== 200 || calls.length) {
      throw new Error(JSON.stringify(out));
    }
  }
});
Deno.test("Stripe lookup error asks for retry, bad JSON is 400", async () => {
  const { d } = deps(null, 500);
  if (
    (await handleEvent(ev("checkout.session.completed", LIVE), d)).status !==
      502
  ) {
    throw new Error("expected 502");
  }
  if ((await handleEvent("{", d)).status !== 400) {
    throw new Error("expected 400");
  }
});
Deno.test("Ardoq-type link notifies owner only", async () => {
  const { d, calls } = deps({
    ...paid,
    payment_link: "plink_1UKyd2QQIEQm1i6qTDJqmtjb",
  });
  await handleEvent(ev("checkout.session.completed", LIVE), d);
  if (calls.length !== 2) throw new Error(String(calls));
});
