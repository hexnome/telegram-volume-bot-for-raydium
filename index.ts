import "dotenv/config";
import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';

import * as commands from './commands'
import { botToken, init } from "./config";
import { waitFor } from "./utils";
// import { init } from "./commands/helper";

const token = botToken
const bot = new TelegramBot(token!, { polling: true });
let botName: string
let editText: string

console.log("Bot started");

bot.getMe().then(user => {
    botName = user.username!.toString()
    console.log("botName--->", user)
})

bot.setMyCommands(commands.commandList)

init()

bot.on(`message`, async (msg) => {
    console.log("msg---->>>", msg)
    const chatId = msg.chat.id!
    const text = msg.text!
    const msgId = msg.message_id!
    const username = msg.from!.username!
    if (text) console.log(`message : ${chatId} -> ${text}`)
    else return
    try {
        let result
        switch (text) {
            case `/start`:
                result = await commands.welcome(chatId, username)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    }, parse_mode: 'HTML'
                })
                break;

            default:
                await bot.deleteMessage(chatId, msgId)
        }
    } catch (e) {
        console.log('error -> \n', e)
    }
});

bot.on('callback_query', async (query: CallbackQuery) => {
    console.log("query---->>>", query)
    const chatId = query.message?.chat.id!
    const msgId = query.message?.message_id!
    const action = query.data!
    const username = query.message?.chat?.username!
    const callbackQueryId = query.id;

    console.log(`query : ${chatId} -> ${action}`)
    try {
        let result
        switch (action) {
            case 'setWallet':
                result = await commands.walletOption(chatId)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    },
                    parse_mode: 'HTML'
                })

                break;
            case 'newWallet':
                result = await commands.newWallet(chatId, username)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    },
                    parse_mode: 'HTML'
                })

                break;
            case 'customWallet':
                const customWallet_msg = await bot.sendMessage(chatId, 'Please send a wallet privateKey for volume market making.')
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.customWallet(chatId, String(msg.text), username)
                        await bot.sendMessage(
                            chatId,
                            result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            },
                            parse_mode: 'HTML'
                        })

                        await bot.deleteMessage(chatId, sendTokenAddr_msg.message_id)
                    }
                })
                break;
            case 'boostVolume':
                result = await commands.selectOption(chatId)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    },
                    parse_mode: 'HTML'
                })

                break;
            case 'package1':
                result = await commands.displaySettings(chatId, username)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    },
                    parse_mode: 'HTML'
                })

                break;
            case 'newWallet':
                result = await commands.newWallet(chatId)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    },
                    parse_mode: 'HTML'
                })
                break;
            case 'makeVolumeWallet':
                result = await commands.makeVolumeWallet(chatId, username)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    },
                    parse_mode: 'HTML'
                }
                )

                break;
            case 'sendTokenAddr':
                const sendTokenAddr_msg = await bot.sendMessage(chatId, 'Please send a token addr for volume market making.')
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.sendTokenAddr(chatId, String(msg.text))
                        await bot.sendMessage(
                            chatId,
                            result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            },
                            parse_mode: 'HTML'
                        })

                        await bot.deleteMessage(chatId, sendTokenAddr_msg.message_id)
                    }
                })
                break;
            case 'sendPoolId':
                const poolId_msg = await bot.sendMessage(chatId, 'Please send a Pool addr of token for volume market making.')
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.sendPoolId(chatId, String(msg.text))
                        await bot.sendMessage(
                            chatId,
                            result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            },
                            parse_mode: 'HTML'
                        })

                        await bot.deleteMessage(chatId, poolId_msg.message_id)
                    }
                })
                break;
            case 'deposit':
                result = await commands.checkDeposit(chatId)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    },
                    parse_mode: 'HTML'
                }
                )

                break;
            case 'confirmWallet':
                result = await commands.confirmWallet(chatId)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    },
                    parse_mode: 'HTML'
                }
                )

                break;
            case 'customOption':
                result = await commands.customOption(chatId, username)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    },
                    parse_mode: 'HTML'
                }
                )

                break;
            case 'setDistributionAmt':
                const setDistributionAmt_msg = await bot.sendMessage(chatId, 'Input amount of SOL to distribute to each wallet')
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.setDistributionAmt(chatId, Number(msg.text))
                        await bot.sendMessage(
                            chatId,
                            result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            },
                            parse_mode: 'HTML'
                        })

                        await bot.deleteMessage(chatId, setDistributionAmt_msg.message_id)
                    }
                })
                break;
            case 'setDistributionWalletNum':
                const setDistributionWalletNum_msg = await bot.sendMessage(chatId, 'Input number of wallets for volume trading')
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.setDistributionWalletNum(chatId, Number(msg.text))
                        await bot.sendMessage(
                            chatId,
                            result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            },
                            parse_mode: 'HTML'
                        })

                        await bot.deleteMessage(chatId, setDistributionWalletNum_msg.message_id)
                    }
                })
                break;
            case 'setBuyUpperAmount':
                const buyUpperAmount_msg = await bot.sendMessage(chatId, 'Input upper limit for random buy amount')
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.setBuyUpperAmount(chatId, Number(msg.text))
                        await bot.sendMessage(
                            chatId,
                            result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            },
                            parse_mode: 'HTML'
                        })

                        await bot.deleteMessage(chatId, buyUpperAmount_msg.message_id)
                    }
                })
                break;
            case 'setBuyLowerAmount':
                const buyLowerAmount_msg = await bot.sendMessage(chatId, 'Input Lower limit for random buy amount')
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.setBuyLowerAmount(chatId, Number(msg.text))
                        await bot.sendMessage(
                            chatId,
                            result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            },
                            parse_mode: 'HTML'
                        })

                        await bot.deleteMessage(chatId, buyLowerAmount_msg.message_id)
                    }
                })
                break;
            case 'setBuyIntervalMax':
                const buyIntervalMax_msg = await bot.sendMessage(chatId, 'Input Maximum interval between buys in milliseconds')
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.setBuyIntervalMax(chatId, Number(msg.text))
                        await bot.sendMessage(
                            chatId,
                            result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            },
                            parse_mode: 'HTML'
                        })

                        await bot.deleteMessage(chatId, buyIntervalMax_msg.message_id)
                    }
                })
                break;
            case 'setBuyIntervalMin':
                const buyIntervalMin_msg = await bot.sendMessage(chatId, 'Input Minimum interval between buys in milliseconds')
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.setBuyIntervalMin(chatId, Number(msg.text))
                        await bot.sendMessage(
                            chatId,
                            result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            },
                            parse_mode: 'HTML'
                        })

                        await bot.deleteMessage(chatId, buyIntervalMin_msg.message_id)
                    }
                })
                break;
            case 'setSellAllByTimes':
                const sellAllByTimes_msg = await bot.sendMessage(chatId, 'Input Number of times to sell all tokens in sub-wallets gradually')
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.setSellAllByTimes(chatId, Number(msg.text))
                        await bot.sendMessage(
                            chatId,
                            result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            },
                            parse_mode: 'HTML'
                        })

                        await bot.deleteMessage(chatId, sellAllByTimes_msg.message_id)
                    }
                })
                break;
            case 'setSlippage':
                const slippage_msg = await bot.sendMessage(chatId, 'Input Slippage')
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.setSlippage(chatId, Number(msg.text))
                        await bot.sendMessage(
                            chatId,
                            result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            },
                            parse_mode: 'HTML'
                        })

                        await bot.deleteMessage(chatId, slippage_msg.message_id)
                    }
                })
                break;
            case 'start':
                result = await commands.start(chatId)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    },
                    parse_mode: 'HTML'
                }
                )

                break;
            case 'cancel':
                result = await commands.cancel(chatId)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    },
                    parse_mode: 'HTML'
                }
                )

                break;
            // case 'setSolAmount':
            //     const setSol_msg = await bot.sendMessage(chatId, '💸 Input sol amount for trading')
            //     bot.once(`message`, async (msg) => {
            //         if (msg.text) {
            //             result = await commands.setSolAmount(chatId, Number(msg.text))
            //             await bot.sendMessage(
            //                 chatId,
            //                 result.title, {
            //                 reply_markup: {
            //                     inline_keyboard: result.content,
            //                     force_reply: false, // Disable input field
            //                 },
            //                 parse_mode: 'HTML'
            //             })

            //             await bot.deleteMessage(chatId, setSol_msg.message_id)
            //         }
            //     })

            //     break;
            // case 'setWalletNum':
            //     const setWallet_msg = await bot.sendMessage(chatId, '💰 Input Number of wallets for trading')
            //     bot.once(`message`, async (msg) => {
            //         if (msg.text) {
            //             result = await commands.setWalletNum(chatId, Number(msg.text))
            //             await bot.sendMessage(
            //                 chatId,
            //                 result.title, {
            //                 reply_markup: {
            //                     inline_keyboard: result.content,
            //                     force_reply: false, // Disable input field
            //                 },
            //                 parse_mode: 'HTML'
            //             })

            //             await bot.deleteMessage(chatId, setWallet_msg.message_id)
            //         }
            //     })

            //     break;

            // case 'resetWallet':
            //     const reset_msg = await bot.sendMessage(chatId, '✏️ Input your wallet address')
            //     bot.once(`message`, async (msg) => {
            //         if (msg.text) {
            //             result = await commands.insertUserInfo(chatId, msg.text)
            //             await bot.sendMessage(
            //                 chatId,
            //                 result.title, {
            //                 reply_markup: {
            //                     inline_keyboard: result.content,
            //                     force_reply: false, // Disable input field
            //                 },
            //                 parse_mode: 'HTML'
            //             })

            //             await bot.deleteMessage(chatId, reset_msg.message_id)
            //         }
            //     })

            //     break
            // case 'wallet_register':
            // const input_msg = await bot.sendMessage(chatId, 'Input your wallet address')
            // bot.once(`message`, async (msg) => {
            //     if (msg.text) {
            //         result = await commands.addressAdd(chatId, msg.text)
            //         await bot.sendMessage(
            //             chatId,
            //             result.title, {
            //             reply_markup: {
            //                 inline_keyboard: result.content,
            //                 force_reply: false, // Disable input field
            //             },
            //             parse_mode: 'HTML'
            //         })

            //         await bot.deleteMessage(chatId, input_msg.message_id)
            //     }
            // })
            // break

            // case 'airdrop':
            //     const tx_msg = await bot.sendMessage(chatId, 'Transaction confirming...')
            //     await waitFor(1000)
            //     result = await commands.handleAirdrop(chatId)
            //     await bot.deleteMessage(chatId, tx_msg.message_id)
            //     await bot.sendMessage(
            //         chatId,
            //         result.title, {
            //         reply_markup: {
            //             inline_keyboard: result.content,
            //             force_reply: false, // Disable input field
            //         },
            //         parse_mode: 'HTML'
            //     })
            //     break

            // case 'start_menu':
            //     result = await commands.welcome(chatId, username)
            //     await bot.sendMessage(
            //         chatId,
            //         result.title, {
            //         reply_markup: {
            //             inline_keyboard: result.content
            //         }, parse_mode: 'HTML'
            //     })
            //     break;
        }
    } catch (e) {
        console.log('error -> \n', e);
    }
})

// await bot.answerCallbackQuery(callbackQueryId, { text: 'Input Token address to buy' })
